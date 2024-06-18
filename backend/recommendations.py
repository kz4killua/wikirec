import wikipedia
import mwparserfromhell
from utilities import parse_page_source
from embeddings import create_embeddings
from vectorstore import query_vectors



def get_recommendations(page_key, item_category):

    # Download the page from Wikipedia. 
    page_object_with_source = wikipedia.get_page_source(page_key)
    source = parse_page_source(page_object_with_source)

    # Create the embedding.
    embedding = create_embeddings([source])[0]

    # Query the vectorstore.
    results = query_vectors(embedding, item_category, 10)
    matches = results['matches']

    response = [match['metadata'] for match in matches]

    return response