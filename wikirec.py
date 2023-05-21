import os

import numpy as np

from helpers import load_data
from recommend import recommend


CATEGORIES = [
    item.name for item in os.scandir('data')
]

DATA = load_data(CATEGORIES)

DATA_EMBEDDINGS = np.array([
    item['embedding'] for item in DATA if item['source']['title']
])


def wikirec(likes, dislikes, categories, best_n, worst_n):
    """Fetch recommendations."""

    # Get embeddings for likes and dislikes
    likes_embeddings = np.array([
        item['embedding'] for item in DATA if item['source']['title'] in likes
    ])
    dislikes_embeddings = np.array([
        item['embedding'] for item in DATA if item['source']['title'] in dislikes
    ])

    # Score each item
    scores = recommend(likes_embeddings, dislikes_embeddings, DATA_EMBEDDINGS)

    # Sort recommendations by scores
    recommendations = (
        item for item, score in sorted(
            zip(DATA, scores), key=lambda x: x[1], reverse=True
        )
    )

    # Keep only the specified categories
    recommendations = filter(
        lambda item: item['category'] in categories,
        recommendations
    )

    # Remove already liked and disliked items
    recommendations = filter(
        lambda item: (
            item['source']['title'] not in likes
            ) and (
        item['source']['title'] not in dislikes
        ),
        recommendations
    )

    recommendations = list(recommendations)

    # Return the top and worst items
    return {
        'best': recommendations[:best_n],
        'worst': recommendations[-worst_n:][::-1]
    }
