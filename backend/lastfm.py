import os
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("LASTFM_API_KEY")


headers = {
    "User-Agent": "Wiki Rec/1.0.0"
}


def search_track(track_query, artist_query):
    """
    https://www.last.fm/api/show/track.search
    """

    url = "http://ws.audioscrobbler.com/2.0/"
    params = {
        'method': "track.search",
        'track': track_query,
        'artist': artist_query,
        'api_key': API_KEY,
        'format': "json"
    }
    response = requests.get(url, params=params, headers=headers)
    return response.json()


def get_track_info(track_query, artist_query):
    """
    https://www.last.fm/api/show/track.getInfo
    """

    url = "http://ws.audioscrobbler.com/2.0/"
    params = {
        'method': "track.getInfo",
        'track': track_query,
        'artist': artist_query,
        'api_key': API_KEY,
        'format': "json"
    }
    response = requests.get(url, params=params, headers=headers)
    return response.json()