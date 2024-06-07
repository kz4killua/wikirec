import csv
import warnings
import wikipedia
import mwparserfromhell
from tqdm import tqdm
from embeddings import create_embeddings
from vectorstore import upsert_vectors



def upload_csv_items_to_vectorstore(csv_path, item_category):

    # Get each item from the given CSV file.
    with open(csv_path, encoding='utf-8', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        items = [row for row in reader]

    # Get page details from Wikipedia
    pages = extract_wikipedia_pages(items, item_category)

    # Create embeddings for each of the extracted pages
    embeddings = create_embeddings([
        page['text'] for page in pages
    ])

    # Delete page texts
    for page in pages:
        del page['text']

    # Upload the embeddings to a Pinecone vectorstore and save their IDs
    vectors = [
        {
            'id': str(page['wikipedia_id']),
            'values': values,
            'metadata': page
        }
        for page, values in zip(pages, embeddings)
    ]
    upsert_vectors(vectors, item_category)

    # Update the CSV
    save_items_to_csv(f"{item_category}.csv", pages)


def extract_wikipedia_pages(items, item_category):
    """
    Get page details for each item in the list.
    """

    extracted_pages = []

    for item in tqdm(items, "Downloading pages"):
        # Search Wikipedia for the item
        if item_category == "books":
            search_query = f"{item['title']} book"
        elif item_category == "films":
            search_query = f"{item['title']} film"
        elif item_category == "games":
            search_query = f"{item['title']} game"
        elif item_category == "songs":
            search_query = f"{item['title']} song"
        elif item_category == "tv-series":
            search_query = f"{item['title']} tv series"
        else:
            raise ValueError(f"Invalid item category: {item_category}")
        
        results = wikipedia.search_content(search_query, 1)
        if len(results['pages']) == 0:
            warnings.warn(f"No results found for {item['title']}")
            continue
        else:
            page_object = results['pages'][0]

        # Get the page source on Wikipedia
        page_object_with_source = wikipedia.get_page_source(page_object['key'])
        source = parse_page_source(page_object_with_source)

        # Save the page
        if page_object['thumbnail']:
            thumbnail = page_object['thumbnail']['url']
        else:
            thumbnail = ""

        extracted_pages.append({
            'wikipedia_id': str(page_object['id']),
            'wikipedia_key': page_object['key'],
            'wikipedia_title': page_object['title'],
            'title': item['title'],
            'thumbnail': thumbnail,
            'text': source,
        })

    return extracted_pages


def parse_page_source(page_object):
    """
    Returns the source text from a Wikipedia page.
    """
    source = page_object['source']
    if page_object['content_model'] == "wikitext":
        wikicode = mwparserfromhell.parse(source)
        source = str(wikicode.strip_code(normalize=True))
    else:
        source = str(source)

    return source


def save_items_to_csv(path, items):
    """
    Saves each dictionary item in a list as a row in a CSV.
    """
    with open(path, 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = list(items[0].keys())
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(items)