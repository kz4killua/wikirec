import os
import requests
from dotenv import load_dotenv


load_dotenv()
ACCESS_TOKEN = os.getenv("WIKIMEDIA_ACCESS_TOKEN")
APP_NAME = os.getenv("WIKIMEDIA_APP_NAME")
ACCOUNT_EMAIL = os.getenv("WIKIMEDIA_ACCOUNT_EMAIL")

headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'User-Agent': f'{APP_NAME} ({ACCOUNT_EMAIL})'
}


def search_content(search_query, number_of_results):
    """
    https://api.wikimedia.org/wiki/Core_REST_API/Reference/Search/Search_content
    """
    language_code = 'en'
    base_url = 'https://api.wikimedia.org/core/v1/wikipedia/'
    endpoint = '/search/page'
    url = base_url + language_code + endpoint
    parameters = {'q': search_query, 'limit': number_of_results}
    response = requests.get(url, headers=headers, params=parameters)
    data = response.json()
    return data


def search_titles(search_query, number_of_results):
    """
    https://api.wikimedia.org/wiki/Core_REST_API/Reference/Search/Search_titles
    """
    language_code = 'en'
    base_url = 'https://api.wikimedia.org/core/v1/wikipedia/'
    endpoint = '/search/title'
    url = base_url + language_code + endpoint
    parameters = {'q': search_query, 'limit': number_of_results}
    response = requests.get(url, headers=headers, params=parameters)
    data = response.json()
    return data



def get_page_source(title):
    """
    https://api.wikimedia.org/wiki/Core_REST_API/Reference/Pages/Get_page_source
    """
    response = requests.get(
        f'https://api.wikimedia.org/core/v1/wikipedia/en/page/{title}',
        headers=headers,
    )
    data = response.json()
    return data