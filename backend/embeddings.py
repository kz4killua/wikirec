import os
from openai import OpenAI
from dotenv import load_dotenv
from vectorstore import chunks
from tqdm import tqdm


load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def create_embeddings(input):

    # Ensure the input does not exceed the max content length
    max_tokens = 8000
    max_characters = max_tokens * 4

    for i in range(len(input)):
        input[i] = input[i][:max_characters]

    embeddings = []

    # Create the embeddings for each chunk
    for input_chunk in chunks(input, 2048, "Creating embeddings"):
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=input_chunk
        )

        # Update the list of embeddings
        embeddings.extend([
            item['embedding'] for item in response.to_dict()['data']
        ])

    return embeddings