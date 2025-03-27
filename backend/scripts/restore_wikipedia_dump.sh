#!/bin/bash

set -e

# Ensure proper usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <wikipedia-dump>"
    exit 1
fi

# Set up variables
DUMP_NAME="$1"
URL="https://dumps.wikimedia.org/enwiki/latest/$DUMP_NAME.sql.gz"
ARCHIVE_PATH="$DUMP_NAME.sql.gz"
SQL_PATH="$DUMP_NAME.sql"
DB_PASSWORD="${MYSQL_ROOT_PASSWORD}"
DB_USER="root"
DB_NAME="wikidb"

# Install necessary packages
apt update
apt install curl
apt install gzip
apt install mariadb-client

# Download the Wikipedia dump
curl -L "$URL" -o "$ARCHIVE_PATH"
if [ $? -ne 0 ]; then
    echo "Failed to download the Wikipedia dump."
    exit 1
fi

# Unzip the downloaded file
gunzip "$ARCHIVE_PATH"
if [ $? -ne 0 ]; then
    echo "Failed to unzip the Wikipedia dump."
    exit 1
fi

# Check if the database exists, and create it if not
mariadb --user="$DB_USER" --password="$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
if [ $? -ne 0 ]; then
    echo "Failed to create the database."
    exit 1
fi

# Restore the dump
mariadb --user="$DB_USER" --password="$DB_PASSWORD" --database="$DB_NAME" < "$SQL_PATH"
if [ $? -ne 0 ]; then
    echo "Failed to restore the Wikipedia dump to the database."
    exit 1
fi

# Clean up the SQL file
rm "$SQL_PATH"
if [ $? -ne 0 ]; then
    echo "Failed to remove the SQL file."
    exit 1
fi

# Print a success message
echo "Wikipedia dump ($DUMP_NAME) updated successfully."