import json
from pathlib import Path

import wikimedia
from summarize import summarize
from embeddings import encode


BOOKS = [

    # Nigerian / African books
    'Purple Hibiscus',
    'Half of a Yellow Sun',
    'Americanah',
    'Things Fall Apart',
    'The Thing Around Your Neck',
    'No Longer at Ease',
    'Arrow of God',
    'A Man of the People',
    'In Dependence',

    # Fantasy
    "The Iron Trial",
    "The Copper Gauntlet",
    "The Red Pyramid",
    "The Throne of Fire",
    "The Serpent's Shadow (Riordan novel)",
    "The Son of Sobek",
    "The Staff of Serapis",
    "The Crown of Ptolemy",

    # Science Fiction
    "Artemis (novel)",
    "Battle Angel Alita",
    "Project Hail Mary",
    "Clay's Ark",
    "Eon (novel)",
    "Journey to the Center of the Earth",
    "Neuromancer",
    "Semper Mars",
    "Redemption Ark",

    # Self-help
    "Redemption Ark",
    "How to Win Friends and Influence People",
    "The 48 Laws of Power",
    "The 7 Habits of Highly Effective People",
    "Think and Grow Rich",
    "Rich Dad Poor Dad",
    "The Power of Positive Thinking",
    "The Gift of Fear",

    # Uncategorized
    "Digital Fortress",
    "The Hunger Games",
    "Catching Fire",
    "Mockingjay",
    "White Fang",
]


TELEVISION = [

    # Tech movies and shows
    "Silicon Valley (TV series)",
    "The Internship",
    "The Social Network",
    "Pirates of Silicon Valley",
    "The IT Crowd",
    "The Imitation Game",

    # Science movies and shows
    "The Big Bang Theory",
    "Young Sheldon",
    "Interstellar (film)",
    "Gattaca",
    "The Martian (film)",
    "Ex Machina (film)",
    "Star Wars",
    "Star Trek",

    # Black / African / Nigerian movies and shows
    "Half of a Yellow Sun (film)",
    "King of Thieves (2022 film)",
    "The Woman King",
    "Harriet (film)",
    "BlacKkKlansman",
]


ARTICLES = [
    
    # Tech articles
    "Python (programming language)",
    "Artificial intelligence",
    "Machine learning",
    "Data science",
    "Web development",
    "JavaScript",
    "HTML",
    "CSS",
    "Computer security",
    "Blockchain",

    # Science articles
    "Rocket",
    "Outer space",
    "Moon",
    "Galaxy",
    "Black hole",
    "Drug discovery",
    "Virus",
    "Antibiotic",
    "Genetic engineering",
    "Microorganism",

    # History articles
    "Nigerian Civil War",
    "Republic of Biafra",
    "Colonialism",
    "Slavery in Africa",
    "Nigeria",

    # Mythology and pseudoscience articles
    "Zeus",
    "Ra",
    "Astrology",
    "Ichor",
    "Astrology",

]



def download(title):

    # Get the article
    source = wikimedia.get_page_source(title)

    # Get a summary
    summary = summarize(source)

    # Get an embedding
    embedding =  encode(summary)

    # Convert the embedding to a Python list
    embedding = [float(n) for n in embedding]

    return {
        'source': source,
        'summary': summary,
        'embedding': embedding,
    }


def save(items, category):

    for i, item in enumerate(items):

        data = download(item)

        # Create the save directory
        path = Path(f"data/{category}/{data['source']['key']}.json")
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w") as f:
            json.dump(data, f)

        print(f"{i + 1}/{len(items)}. {data['source']['key']}")



def main():
    save(BOOKS, 'books')

if __name__ == "__main__":
    main()