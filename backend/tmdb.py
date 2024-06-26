import os
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
ACCESS_TOKEN = os.getenv("TMDP_READ_API_TOKEN")


def search_movie(q):
    # https://developer.themoviedb.org/reference/search-movie
    url = "https://api.themoviedb.org/3/search/movie"
    params = {
        'query': q,
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    return response.json()



def search_tv(q):
    # https://developer.themoviedb.org/reference/search-tv
    url = "https://api.themoviedb.org/3/search/tv"
    params = {
        'query': q,
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    return response.json()


def get_image_url(file_path, file_size="w500"):
    # https://developer.themoviedb.org/docs/image-basics
    base_url = "https://image.tmdb.org/t/p/"
    return f"{base_url}{file_size}{file_path}"