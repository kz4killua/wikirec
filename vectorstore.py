import os
from dotenv import load_dotenv
from pinecone import Pinecone
import itertools
from tqdm import tqdm


load_dotenv()
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index = pc.Index(os.getenv('PINECONE_INDEX_NAME'))



def chunks(iterable, batch_size, desc=None):
    """A helper function to break an iterable into chunks of size batch_size."""
    it = iter(tqdm(iterable, desc=desc))
    chunk = tuple(itertools.islice(it, batch_size))
    while chunk:
        yield chunk
        chunk = tuple(itertools.islice(it, batch_size))


def upsert_vectors(vectors, namespace):
    """
    https://docs.pinecone.io/reference/api/data-plane/upsert
    """
    for vectors_chunk in chunks(vectors, 100, "Upserting vectors"):
        index.upsert(vectors_chunk, namespace=namespace)