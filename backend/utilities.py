import re
import csv
import warnings
import wikipedia
import openlibrary
import musicbrainz
import tmdb
import rawg
import mwparserfromhell
from tqdm import tqdm
from embeddings import create_embeddings
from vectorstore import upsert_vectors



def upload_csv_items_to_vectorstore(csv_path, item_category):

    # Get each item from the given CSV file.
    items = load_items_from_csv(csv_path)

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

        # Add the item category to the search query
        if item_category == "books":
            search_query = f"{item['title']} book"
        elif item_category == "movies":
            search_query = f"{item['title']} film"
        elif item_category == "games":
            search_query = f"{item['title']} game"
        elif item_category == "music":
            search_query = f"{item['title']} {item['artist']} song"
        elif item_category == "tv-series":
            search_query = f"{item['title']} series"
        else:
            raise ValueError(f"Invalid item category: {item_category}")
        
        # Search Wikipedia for each item
        results = wikipedia.search_content(search_query, 5)
        results = results['pages']

        if len(results) == 0:
            warnings.warn(f"No search results found for {item['title']}")
            continue

        # Find the item with a matching title
        page_object = None
        for page in results:
            if compare_strings(page['title'], item['title']):
                page_object = page
                break
            elif compare_strings(clean_wikipedia_title(page['title']), item['title']):
                page_object = page
                break

        if page_object is None:
            warnings.warn(f"No search results found for {item['title']}")
            continue

        # Get the page source on Wikipedia
        page_object_with_source = wikipedia.get_page_source(page_object['key'])
        source = parse_page_source(page_object_with_source)

        # Extract the cover image for the item
        thumbnail = ""

        if item_category == "books":
            thumbnail = find_book_cover(item['title']) or ""
        elif item_category == "movies":
            thumbnail = find_movie_poster(item['title']) or ""
        elif item_category == "tv-series":
            thumbnail = find_tv_series_poster(item['title']) or ""
        elif item_category == "games":
            thumbnail = find_game_cover(item['title']) or ""
        elif item_category == "music":
            thumbnail = find_song_cover(item['title'], item['artist']) or ""
        else:
            raise ValueError(f"Invalid item category: {item_category}")

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


def find_book_cover(title):
    """
    Find the cover for a book with a given title using Open Library.
    """

    # Search for the book
    matches = openlibrary.search(title, limit=5, fields='key,title,editions,editions.key')

    if matches['numFound'] == 0:
        return None
    
    for item in matches['docs'][:5]:
        if compare_strings(title, item['title']):

            try:
                key = matches['docs'][0]['editions']['docs'][0]['key']
            except IndexError:
                continue

            olid = key.split("/")[-1]
            return openlibrary.covers(olid)
        
    return None


def find_movie_poster(title):
    """
    Find the poster for a given movie title using TMDB.
    """

    results = tmdb.search_movie(title)

    if results['total_results'] == 0:
        return None
        
    for item in results['results'][:5]:
        if compare_strings(title, item['title']):
            return tmdb.get_image_url(results['results'][0]['poster_path'])
        
    return None


def find_tv_series_poster(title):
    """
    Find the poster for a given TV series title using TMDB.
    """

    results = tmdb.search_tv(title)

    if results['total_results'] == 0:
        return None
    
    for item in results['results'][:5]:
        if compare_strings(title, item['name']):
            return tmdb.get_image_url(results['results'][0]['poster_path'])

    return None


def find_game_cover(title):
    """
    Find the poster for a given TV series title using RAWG.
    """

    results = rawg.search_games(title)

    if results['count'] == 0:
        return None
    
    for item in results['results'][:5]:
        if compare_strings(title, item['name']):
            return item['background_image']
    
    return None


def find_song_cover(title, artist):
    """
    Find the cover for a song with a given title using MusicBrainz.
    """

    results = musicbrainz.search("release", title, artist, 5, 0)
    
    if results['count'] == 0:
        return None
        
    for item in results['releases'][:5]:
        if compare_strings(title, item['title']):
            cover_art =  musicbrainz.get_cover_art(item['id'])
            if cover_art is None:
                continue
            return cover_art['images'][0]['thumbnails']['large']
            
    return None


def save_items_to_csv(path, items):
    with open(path, 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = list(items[0].keys())
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(items)


def load_items_from_csv(path):
    with open(path, encoding='utf-8', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        items = [row for row in reader]
    return items


def clean_wikipedia_title(title):
    """
    Cleans a Wikipedia title by removing parenthesized metadata. 

    E.g. Suits (American TV Series) -> Suits
    """
    pattern = r'\s*\([^)]*\)$'
    return re.sub(pattern, '', title.strip())


def compare_strings(s1, s2):

    s1 = s1.lower()
    s2 = s2.lower()

    # Remove all special characters, and spaces
    s1 = ''.join(c for c in s1 if c.isalnum())
    s2 = ''.join(c for c in s2 if c.isalnum())

    return s1 == s2