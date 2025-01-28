import psycopg2
from psycopg2 import sql

def create_database():
    # Connect to the default 'postgres' database to perform admin tasks
    conn = psycopg2.connect(
        dbname="postgres",     # Connect to the default postgres database
        user="postgres",       # Change this to your actual PostgreSQL username
        password="#aH6TR5fkcdx99",  # Change this to your actual password
        host="localhost",
        port="5432"
    )
    conn.autocommit = True  # Enable autocommit mode for database creation

    # Create a cursor object
    cursor = conn.cursor()

    # Check if the database 'TestDB' already exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'TestDB'")
    exists = cursor.fetchone()

    # Only create the database if it doesn't exist
    if not exists:
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier("TestDB")))
        print("Database 'TestDB' created successfully!")
    else:
        print("Database 'TestDB' already exists.")

    # Close the cursor and connection
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_database()
