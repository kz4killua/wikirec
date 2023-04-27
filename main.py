import numpy as np

from helpers import load_data
from recommend import recommend


def main():

    # Load all items
    data = load_data(['articles', 'television'])

    # Define likes and dislikes
    likes = [
        "Machine learning",
        "Blockchain",
        "Web development",
    ]
    dislikes = [
        "The Woman King",
    ]

    # Get embeddings for likes, dislikes, and data
    likes_embeddings = np.array([
        item['embedding'] for item in data if item['source']['title'] in likes
    ])
    dislikes_embeddings = np.array([
        item['embedding'] for item in data if item['source']['title'] in dislikes
    ])
    data_embeddings = np.array([
        item['embedding'] for item in data if item['source']['title']
    ])

    # Make recommendations
    scores = recommend(likes_embeddings, dislikes_embeddings, data_embeddings)

    # Print out top recommendations
    results = {
        data[i]['source']['title'] : scores[i] for i in range(len(scores))
    }

    # TODO: Ignore likes and dislikes
    NotImplemented

    # TODO: Filter out items not in the desired categories
    NotImplemented

    for title, score in sorted(results.items(), key = lambda item: item[1], reverse=True):
        print(f"{title} -> {score}")


if __name__ == "__main__":

    import time
    
    tic = time.time()
    main()
    toc = time.time()

    print("Time:", toc - tic)