import wikipedia


def get_search_results(search_query, item_category):
    """
    Returns search results for a given query.
    """
    search_query = f"{search_query} ({item_category})"
    results = wikipedia.search_content(search_query, 5)
    return results['pages']