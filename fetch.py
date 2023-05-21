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

    # Mythology
    "The Red Pyramid",
    "The Throne of Fire",
    "The Serpent's Shadow (Riordan novel)",
    "The Son of Sobek",
    "The Staff of Serapis",
    "The Crown of Ptolemy",
    "The Last Olympian",
    "The Sea of Monsters",

    # Fantasy
    "The Iron Trial",
    "The Copper Gauntlet",
    'Harry Potter and the Deathly Hallows',
    'Harry Potter and the Half-Blood Prince',
    'Harry Potter and the Order of the Phoenix',
    'A Game of Thrones',
    'The Hobbit',
    'The Lord of the Rings',

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
    "Thor",

    # Sports
    "Lionel Messi",
    "Cristiano Ronaldo",
    "FIFA World Cup",
    "Premier League",

    "Stephen Curry",
    "Golden State Warriors",

]


MUSIC = [

    # Rap
    "Rap God",
    "Lose Yourself",
    "Look at Me Now (Chris Brown song)",
    "Panda (song)",
    "Mockingbird (Eminem song)",
    "Stan (song)",
    "Humble (song)",
    "DNA (Kendrick Lamar song)",

    # Classical / Opera
    "The Four Seasons (Vivaldi)",
    "The Magic Flute",
    "Don Giovanni",
    "The Marriage of Figaro",
    "The Barber of Seville",
    "Carmen",
    "Casanova",
    "Otello",

]


RECIPES = [

    # Nigerian / West African
    "Jollof rice",
    "Akara",
    "Okpa",
    "Abacha",
    "Peppersoup",

    # Asian, European, American
    "Pizza",
    "Pasta",
    "Steak",
    "Chicken as food",
    "Barbecue",

]


GAMES = [
    
    # Basketball games
    'NBA 2K23',
    'NBA 2K22',

    # Soccer
    'FIFA 23',
    'FIFA 22',
    'FIFA 21',
    'Football Manager 2023',
    'Football Manager 2022',
    'Pro Evolution Soccer 2019',
    'Pro Evolution Soccer 2016',

    # Fantasy
    'God of War (2018 video game)',
    'The Legend of Zelda',
    'The Witcher 3: Wild Hunt',
    'Final Fantasy XV',
    'Hogwarts Legacy',
    'Elden Ring'
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
    save(ARTICLES, 'articles')
    save(BOOKS, 'books')
    save(TELEVISION, 'television')
    save(GAMES, 'games')
    save(RECIPES, 'recipes')
    save(MUSIC, 'music')

if __name__ == "__main__":
    main()