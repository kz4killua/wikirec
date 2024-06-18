from utilities import upload_csv_items_to_vectorstore


def main():
    upload_csv_items_to_vectorstore("data/test/films.csv", "films")
    upload_csv_items_to_vectorstore("data/test/books.csv", "books")


if __name__ == "__main__":
    main()