import os
from openai import OpenAI
from dotenv import load_dotenv
from vectorstore import chunks
from tqdm import tqdm
import tiktoken


load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
tiktoken_cache_dir = "tiktoken_cache"
os.makedirs(tiktoken_cache_dir, exist_ok=True)
os.environ["TIKTOKEN_CACHE_DIR"] = tiktoken_cache_dir
EMBEDDING_MODEL = "text-embedding-3-small"

# Pre-cache the tiktoken encodings
tiktoken.encoding_for_model(EMBEDDING_MODEL)


def create_embeddings(input: list[str]):

    # Ensure the input does not exceed the max content length
    max_tokens = 8191
    enc = tiktoken.encoding_for_model(EMBEDDING_MODEL)
    for i in range(len(input)):
        input[i] = enc.decode(enc.encode(input[i])[:max_tokens])

    embeddings = []

    # Create the embeddings for each chunk
    for input_chunk in chunks(input, 2048, "Creating embeddings"):
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=input_chunk
        )

        # Update the list of embeddings
        embeddings.extend([
            item['embedding'] for item in response.to_dict()['data']
        ])

    return embeddings


def average_embeddings(embeddings: list[list[float]]) -> list[float]:
    """Return the average of a list of embeddings."""
    mean = []
    for items in zip(*embeddings, strict=True):
        mean.append(sum(items) / len(items))
    return mean