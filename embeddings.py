import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def create_embeddings(input):

    # Ensure the input does not exceed the max content length
    max_tokens = 8000
    max_characters = max_tokens * 4

    if isinstance(input, str):
        input = input[:max_characters]
    elif isinstance(input, list):
        for i in range(len(input)):
            input[i] = input[i][:max_characters]

    # Create the embeddings
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=input
    )
    embeddings = [
        item['embedding'] for item in response.to_dict()['data']
    ]
    return embeddings