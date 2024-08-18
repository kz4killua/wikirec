# 🍿 Wiki Rec
A cross-category recommendation engine, powered by Wikipedia. 

## Overview
Wiki Rec uses data from Wikipedia to recommend similar items to users. Users can get recommendations for books, movies, TV series, music, and games. The real strength of Wiki Rec however, is in its ability to make cross-category recommendations. For example, you can find movies similar to your favorite books. Or maybe you're looking for games similar to your favorite TV series. Wiki Rec helps you get recommendations for anything. Try it out [here](https://wikirec.ifeanyiobinelo.com/).

## Approach
The Wikipedia pages for different books, movies, TV series, music, and games were first downloaded and then used to create text embeddings. These embeddings are used to rank items by similarity. The embeddings are stored in a vector database and queried using a serverless function.  
