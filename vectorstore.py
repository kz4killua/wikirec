import os
from dotenv import load_dotenv
from pinecone import Pinecone


load_dotenv()
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index = pc.Index(os.getenv('PINECONE_INDEX_NAME'))


def upsert_vectors(vectors, namespace):
    """
    https://docs.pinecone.io/reference/api/data-plane/upsert
    """
    response = index.upsert(vectors, namespace=namespace)
    return response