import os
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("RAWG_API_KEY")


def search_games(query):
    url = "https://api.rawg.io/api/games"
    params = {
        "search": query,
        "key": API_KEY
    }
    response = requests.get(url, params=params)
    response = response.json()
    return response