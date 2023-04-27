from embeddings import util


def recommend(likes, dislikes, data):
    """Predicts how likely a user is to like some content."""

    # Calculate cosine similarities with the likes
    a = util.cos_sim(data, likes)
    # Calculate cosine similarities with the dislikes
    b = util.cos_sim(data, dislikes)

    # Sum up the scores
    a = a.sum(axis=1)
    b = b.sum(axis=1)

    # Penalize similarity with the dislikes
    scores = a - b

    return scores