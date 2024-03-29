# Overview
WikiRec is a proof-of-concept content recommendation system powered by both Wikipedia and Azure Cognitive Services. It learns a users likes and dislikes and makes recommendations for books, movies, music, TV series, articles, games, recipes, etc. 

The real strength of WikiRec is in its ability to make cross-category recommendations. A user's tastes in movies can help inform book recommendations. A user's tastes in games can help inform music recommendations. A user's tastes in articles can be used to recommend recipes. And much more!

As an example, someone who likes fantasy books may be more inclined to fantasy movies. Someone who reads a lot of sports articles will probably prefer sports games.

# Technical Description
Articles from Wikipedia are first summarized using Azure's Language Service, then used to create "text embeddings". These can be used to check similarity with other articles, movies, books, etc. 

When a user tells the system that they like some items, the recommendations will be biased towards items that have similar text embeddings to those of the liked items. If the user dislikes some items, the recommendations will favour items that have lower similarities to the disliked content.
