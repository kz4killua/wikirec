import os
import urllib.parse
import hashlib
import xml.etree.ElementTree as ET 
import requests
import bz2
from tqdm import tqdm
import mwparserfromhell
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, HnswConfigDiff


def download_dump(checksum: str):
    """Download the latest Wikipedia articles dump."""
    
    url = "https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles-multistream.xml.bz2"
    path = "enwiki-latest-pages-articles-multistream.xml.bz2"
    response = requests.get(url, stream=True)
    response.raise_for_status()

    md5 = hashlib.md5()
    with open(path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
            md5.update(chunk)
        
    if md5.hexdigest() != checksum:
        raise ValueError(f"Checksum mismatch: expected {checksum}, got {md5.hexdigest()}")

    return path


def download_dump_index(checksum: str):
    """Download the latest Wikipedia articles index."""

    url = "https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles-multistream-index.txt.bz2"
    path = "enwiki-latest-pages-articles-multistream-index.txt.bz2"
    response = requests.get(url, stream=True)
    response.raise_for_status()

    md5 = hashlib.md5()
    with open(path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
            md5.update(chunk)

    if md5.hexdigest() != checksum:
        raise ValueError(f"Checksum mismatch: expected {checksum}, got {md5.hexdigest()}")

    return path


def load_checksums():
    """Load MD5 checksums for the latest Wikipedia dump."""

    url = "https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-md5sums.txt"
    response = requests.get(url)
    response.raise_for_status()

    checksums = dict()
    for line in response.text.splitlines():
        checksum, filename = line.split()
        checksums[filename] = checksum

    return checksums


def load_stream_offsets(index_path: str) -> list:
    """Load stream offsets from the Wikipedia index file."""
    
    offsets = set()

    # Read stream offsets from the index file
    with bz2.open(index_path, 'rt', encoding='utf-8') as f:
        for line in f:
            file_offset, _, _ = line.strip().split(":", 2)
            offsets.add(int(file_offset))

    # Return offsets in sorted order
    offsets = sorted(offsets)
    return offsets


def find_infobox(wikicode: mwparserfromhell.wikicode.Wikicode) -> mwparserfromhell.wikicode.Template:
    """Extract the infobox from a Wikipedia page."""
    
    for template in wikicode.filter_templates():
        if template.name.strip().lower().startswith("infobox"):
            return template
    
    return None


def parse_infobox(infobox: mwparserfromhell.wikicode.Template) -> str:
    """Extract details from the infobox."""

    category = None
    parts = str(infobox.name).split(maxsplit=1)
    if len(parts) >= 2:
        category = parts[1].strip().lower()

    image = None
    if infobox.has("image"):
        image = infobox.get("image").value.strip()

    return {'category': category, 'image': image}


def normalize_title(title: str) -> str:
    """Normalize the title of a Wikipedia page or image."""
    return urllib.parse.quote(title.replace(' ', '_'), safe='_()')


def stream_dump(dump_path: str, index_path: str):
    """Stream page chunks from the Wikipedia dump."""
    
    offsets = load_stream_offsets(index_path)

    with open(dump_path, 'rb') as f:
        for i in tqdm(range(len(offsets)), desc="Reading page chunks"):

            # Calculate the size of each chunk
            offset = offsets[i]
            if i == len(offsets) - 1:
                length = -1
            else:
                length = offsets[i + 1] - offset

            # Read each chunk of pages
            f.seek(offset)
            chunk = f.read(length)
            if not chunk:
                break

            # Decompress the chunk and decode it
            decompressed = bz2.decompress(chunk)
            decoded = decompressed.decode('utf-8')

            yield decoded


def parse_pages(chunk: str):
    """Parse a Wikipedia dump chunk and extract relevant information from each page."""

    # Remove any extra closing tags on the last chunk
    chunk = chunk.removesuffix('</mediawiki>')

    # Split the chunk into individual pages
    chunk = f"<chunk>\n{chunk}\n</chunk>"
    tree = ET.fromstring(chunk)
    pages = tree.findall('page')

    for page in pages:

        # Extract the title of each page, its ID, and its text
        page_title = page.find('title').text
        page_id = page.find('id').text
        page_text = page.find('revision/text').text

        if not all([page_text, page_title, page_id]):
            continue

        # Parse the page text using mwparserfromhell
        wikicode = mwparserfromhell.parse(page_text)

        infobox = find_infobox(wikicode)
        if not infobox:
            continue

        infobox_details = parse_infobox(infobox)

        page_image = infobox_details['image']
        if not page_image:
            continue

        # Skip pages in uninteresting categories
        page_category = infobox_details['category']
        if page_category not in {'book', 'television', 'video game', 'song', 'film'}:
            continue

        # Extract the text from the page
        page_text = str(wikicode.strip_code())

        yield {
            'id': int(page_id),
            'title': page_title,
            'image': page_image,
            'text': page_text,
            'category': page_category,
        }


def truncate_text(text: str, max_tokens: int, model) -> str:
    """Truncate text to a maximum number of tokens."""
    tokenizer = model.tokenizer
    tokens = tokenizer.encode(text, max_length=max_tokens, truncation=True)
    return tokenizer.decode(tokens, skip_special_tokens=True)


def create_embeddings(sentences: list[str]):
    """Create embeddings for the given sentences."""
    model_name = 'sentence-transformers/all-MiniLM-L6-v2'
    max_tokens = 256
    model = SentenceTransformer(model_name)
    sentences = [truncate_text(sentence, max_tokens, model) for sentence in sentences]
    embeddings = model.encode(sentences)
    return embeddings


def store_embeddings(ids: list[int], vectors: list[list], payloads: list):
    """Store embeddings in the Qdrant vector database."""

    # Validate the input data
    if len(ids) != len(vectors) or len(ids) != len(payloads):
        raise ValueError("IDs, vectors, and payloads must have the same length.")

    # Initialize the Qdrant client
    client = QdrantClient(url=os.getenv("QDRANT_URL"))

    # Create a collection if it doesn't exist
    collection_name = "wiki_embeddings"
    if not client.collection_exists(collection_name):
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE, on_disk=True),
            hnsw_config=HnswConfigDiff(on_disk=True),
        )

    # Store the embeddings in the collection
    client.upsert(
        collection_name=collection_name,
        points=[
            PointStruct(id=id, vector=vector, payload=payload)
            for id, vector, payload in zip(ids, vectors, payloads)
        ],
    )


def main():

    # NOTE: For now, we use a local (partial) dump.
    dump_path = "enwiki-20250301-pages-articles-multistream1.xml-p1p41242.bz2"
    index_path = "enwiki-20250301-pages-articles-multistream-index1.txt-p1p41242.bz2"

    for chunk in stream_dump(dump_path, index_path):
        pages = parse_pages(chunk)

        # Store embeddings and metadata in Qdrant
        sentences = [page['text'] for page in pages]
        embeddings = create_embeddings(sentences)
        ids = [int(page['id']) for page in pages]
        payloads = [
            {
                'title': page['title'],
                'image': page['image'],
                'category': page['category'],
            }
            for page in pages
        ]
        store_embeddings(ids, embeddings, payloads)


if __name__ == "__main__":
    main()