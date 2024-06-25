import os
import requests
from dotenv import load_dotenv


load_dotenv()
ACCOUNT_EMAIL = os.getenv("OPENLIBRARY_ACCOUNT_EMAIL")

headers = {
    "User-Agent": f"WikiRec/1.0 ({ACCOUNT_EMAIL}@gmail.com)"
}


def search(q, limit, fields='*'):
    # https://openlibrary.org/dev/docs/api/search
    url = "https://openlibrary.org/search.json"
    parameters = {'q': q, 'fields': fields, 'limit': limit}
    response = requests.get(url, headers=headers, params=parameters)
    return response.json()


def covers(olid, size="L"):
    # https://openlibrary.org/dev/docs/api/covers
    url = f"https://covers.openlibrary.org/b/olid/{olid}-{size}.jpg"
    return url