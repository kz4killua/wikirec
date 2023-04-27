import os

import requests

APP_NAME = 'super-recommender'

HEADERS = {
    'Authorization': f'Bearer {os.environ["WIKIMEDIA_API_ACCESS_TOKEN"]}',
}

def get_page_source(title):
    """Returns page contents."""

    response = requests.get(
        f'https://api.wikimedia.org/core/v1/wikipedia/en/page/{title}',
        headers=HEADERS
    )

    data = response.json()

    return data