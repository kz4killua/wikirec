import os
import requests
from dotenv import load_dotenv


load_dotenv()
CLIENT_ID = os.getenv("IGBD_CLIENT_ID")
CLIENT_SECRET = os.getenv("IGDB_CLIENT_SECRET")


headers = {
    'Client-ID': 'Client ID', 
    'Authorization': f'Bearer {CLIENT_SECRET}'
}


def get_token():
    url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, params=params)
    response = response.json()
    return response



def search_games(query, access_token, fields="*"):
    url = "https://api.igdb.com/v4/games"
    headers = {
        'Client-ID': CLIENT_ID, 
        'Authorization': f'Bearer {access_token}'
    }
    data = f'search "{query}"; fields {fields};'
    response = requests.post(url, headers=headers ,data=data)
    response = response.json()
    return response


def get_cover(cover_id, access_token, fields="*"):
    headers = {
        'Client-ID': CLIENT_ID, 
        'Authorization': f'Bearer {access_token}'
    }
    url = "https://api.igdb.com/v4/covers"
    data = f'fields {fields}; where id = {cover_id};'
    response = requests.post(url, headers=headers, data=data)
    response = response.json()
    return response

