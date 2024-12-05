import psycopg2
from psycopg2 import sql

def create_tables():
    # Connect to the 'TestDB' database
    conn = psycopg2.connect(
        dbname="TestDB",
        user="postgres",
        password="#aH6TR5fkcdx99",
        host="localhost",
        port="5432"
    )
    
    # Create a cursor object
    cursor = conn.cursor()


    # 2024-14-11 Created users Table

    """
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL, 
        role VARCHAR(20),
        building VARCHAR(20)
    );
    """

    # 2024-17-11 Created Claimed Items, Items and Buildings Table
    """
    CREATE TABLE IF NOT EXISTS claimedItems (
    itemType VARCHAR(50),
    LocationFound VARCHAR(100),
    itemDescription VARCHAR(100),
    dateFound DATE,
    dateClaimed DATE,
    LFlocation VARCHAR(10),
    PRIMARY KEY (itemType, LocationFound, itemDescription)
    );
    """
    """
    CREATE TABLE IF NOT EXISTS items (
    itemType VARCHAR(10),
    LocationFound VARCHAR(100),
    itemDescription VARCHAR(100),
    dateFound DATE,
    LFlocation VARCHAR(10),
    PRIMARY KEY (itemType, LocationFound, itemDescription)
    );
    """
    # Define SQL queries for creating tables
    create_table_queries = []

    # Execute each query to create tables
    for query in create_table_queries:
        cursor.execute(query)
    
    # Commit changes and close the connection
    conn.commit()
    cursor.close()
    conn.close()
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()
