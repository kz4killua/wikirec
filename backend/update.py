import os
import itertools
import hashlib
import xml.etree.ElementTree as ET 
import requests
import bz2
from tqdm import tqdm
import csv
import mwparserfromhell
from sentence_transformers import SentenceTransformer
from typing import Iterable
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


# TODO: Use infoboxes to figure out categories: https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
# TODO: Infobox book, infobox television, infobox video game, infobox song, infobox film
# TODO: Verify stripped text by eye for a few articles
# TODO: Verify yielding and memory loading. Do not load all pages at once
# TODO: Consider securing Qdrant
# TODO: Add unit tests
# TODO: Delete the dumps after processing
# TODO: Update the vector db periodically (e.g., once a month)
# NOTE: Release dates can be (accurately) gotten from the infoboxes
# NOTE: You can do popularity actually. But how will you filter this?


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


def load_categories() -> dict[str, str]:
    """Load the mapping of Wikipedia categories to Wikirec categories."""
    
    path = "categories.csv"
    categories = dict()

    with open(path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            categories[row['wikipedia_category']] = row['wikirec_category']
    
    return categories


def create_image_url(image: str, namespace="en") -> str:
    """Creates the Wikimedia URL for a Wikipedia image."""
    image = normalize_title(image)
    md5 = hashlib.md5()
    md5.update(image.encode('utf-8'))
    md5_hash = md5.hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/{namespace}/{md5_hash[:1]}/{md5_hash[:2]}/{image}"


def normalize_title(title: str) -> str:
    """Normalize the title of a Wikipedia page or image."""
    # Source: https://gerrit.wikimedia.org/r/plugins/gitiles/operations/dumps/+/ariel/toys/bz2multistream/wikiarticles.py
    return title.replace('_', ' ').replace('&', '&amp;').replace('"', "&quot;")


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


def parse_pages(chunk: str, categories: dict):
    """Parse a Wikipedia dump chunk and extract relevant information from each page."""

    # Remove extra closing tag on the last chunk
    if chunk.endswith('</mediawiki>'):
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

        # Ensure the page is in the specified categories
        page_category = None
        for category in categories:
            if f'[[Category:{category}]]' in page_text:
                page_category = categories[category]
                break
        else:
            continue

        # Parse the page text using mwparserfromhell
        wikicode = mwparserfromhell.parse(page_text)

        # Extract the page image from the infobox
        page_image = None
        for template in wikicode.filter_templates():
            if template.name.strip().startswith("Infobox"):
                if template.has("image"):
                    page_image = template.get("image").value.strip()
                    page_image = create_image_url(page_image)
                    break

        # Extract the text from the page
        page_text = str(wikicode.strip_code())

        yield {
            'id': int(page_id),
            'title': page_title,
            'image': page_image,
            'text': page_text,
            'category': page_category,
        }


def batches(iterable: Iterable, batch_size: int):
    """Yield successive batches from an iterable."""
    iterator = iter(iterable)
    batch = tuple(itertools.islice(iterator, batch_size))
    while batch:
        yield batch
        batch = tuple(itertools.islice(iterator, batch_size))


def truncate_text(text: str, max_tokens: int, model) -> str:
    """Truncate text to a maximum number of tokens."""
    tokenizer = model.tokenizer
    tokens = tokenizer.encode(text, max_length=max_tokens, truncation=True)
    return tokenizer.decode(tokens, skip_special_tokens=True)


def create_embeddings(sentences: list[str]):
    """Create embeddings for the given sentences."""
    model_name = 'all-MiniLM-L6-v2'
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
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE,
            ),
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
    categories = load_categories()

    for chunk in stream_dump(dump_path, index_path):
        pages = parse_pages(chunk, categories)
        for batch in batches(pages, 32):
            
            # Store embeddings and metadata in Qdrant
            print(f"Processing batch of {len(batch)} pages")
            sentences = [page['text'] for page in batch]
            embeddings = create_embeddings(sentences)
            ids = [int(page['id']) for page in batch]
            payloads = [
                {
                    'title': page['title'],
                    'image': page['image'],
                    'category': page['category'],
                }
                for page in batch
            ]
            store_embeddings(ids, embeddings, payloads)


if __name__ == "__main__":
    main()