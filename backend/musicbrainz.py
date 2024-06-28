import os
import requests
from dotenv import load_dotenv


load_dotenv()
EMAIL = os.getenv("MUSICBRAINZ_EMAIL")


headers = {
    "User-Agent": f"WikiRec/1.0.0 ( {EMAIL} )"
}


def search(type, title_query, artist_query, limit, offset):
    """
    https://musicbrainz.org/doc/MusicBrainz_API/Search
    """
    url = f"https://musicbrainz.org/ws/2/{type}"
    params = {
        'fmt': "json",
        'query': f'{type}:"{title_query}" AND artist:"{artist_query}"',
        'limit': limit,
        'offset': offset
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()


def get_cover_art(mbid):
    """
    https://musicbrainz.org/doc/Cover_Art_Archive/API
    """
    url = f"https://coverartarchive.org/release/{mbid}"
    response = requests.get(url, headers=headers)
    if response.status_code == 404:
        return None
    else:
        return response.json()