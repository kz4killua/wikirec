import os
import json
import re

import numpy as np
import mwparserfromhell


def load_data(categories):

    output = []

    for category in categories:

        for item in os.scandir(f'data/{category}'):

            with open(item.path) as f:
                content = json.load(f)

            content['embedding'] = np.array(content['embedding'], dtype=np.float32)

            output.append(content)

    return output


def try_summary():

    documents = []

    folders = [
        'Digital Fortress',
        'Mockingjay',
        'Project Hail Mary',
        'Purple Hibiscus',
        'The Red Pyramid',
    ]

    for folder in folders:
        
        with open(f'data/books/{folder}/source.json') as f:
            source = json.load(f)

            documents.append(source)

    return documents


def summarize_page_source(source):

    wikitext = source['source']
    wikicode = mwparserfromhell.parse(wikitext)

    # Get the sections we are interested in
    sections = wikicode.get_sections()
    sections = sections[:2]
    
    # Get each section's text
    sections = [str(section) for section in sections]

    # Combine the texts
    document = "\n\n".join(sections)

    # Remove strange characters
    for character in "[]":
        document = document.replace(character, '')

    document = re.sub(r"\{\{[\s\S]*?\}\}", "", document)

    document = re.sub(r"('{2,})", "", document)

    document = re.sub(r"==.*?==", "", document)

    return document
