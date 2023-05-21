from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-mpnet-base-v2')

def encode(sentences):
    return model.encode(sentences)