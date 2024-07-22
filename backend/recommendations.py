import wikipedia
from utilities import parse_page_source
from embeddings import create_embeddings, average_embeddings
from vectorstore import query_vectors


def get_recommendations(page_keys, item_category, count):

    # Download the pages from Wikipedia. 
    page_sources = [
        parse_page_source(
            wikipedia.get_page_source(page_key)
        )
        for page_key in page_keys
    ]

    # Create and average the embeddings for each of the pages.
    embeddings = create_embeddings(page_sources)
    query = average_embeddings(embeddings)

    # Query the vectorstore.
    results = query_vectors(query, item_category, count)
    matches = results['matches']
    response = [match['metadata'] for match in matches]

    return response