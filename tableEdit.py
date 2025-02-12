import psycopg2
from psycopg2 import sql

def connect_db():
    conn = psycopg2.connect(
        dbname="TestDB",
        user="postgres",
        password="#aH6TR5fkcdx99",
        host="localhost",
        port="5432"
    )
    conn.autocommit = True
    return conn

def show_config_file():
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Execute the query to get the configuration file path
        cursor.execute("SHOW config_file;")
        config_file_path = cursor.fetchone()[0]  # Fetch the first (and only) row

        print(f"PostgreSQL Configuration File Path: {config_file_path}")

        # Close the cursor and connection
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"An error occurred while fetching the config file path: {e}")

def apply_changes():
    conn = connect_db()
    cursor = conn.cursor()

    # 2024-11-12: Added locationFound column and buildingCode foreign key to items
    """
    ALTER TABLE items
    ADD COLUMN IF NOT EXISTS buildingCode VARCHAR(50) REFERENCES building(buildingCode);
    """
    # 2024-11-14: Added item type and brand (optional) columns for the Item table and removed "Item name" column
    """
    ALTER TABLE items
    ADD COLUMN IF NOT EXISTS itemType VARCHAR(50);
    """
    """
    ALTER TABLE items
    ADD COLUMN IF NOT EXISTS brand VARCHAR(50) NULL;
    """
    """
    ALTER TABLE items
    DROP COLUMN itemName;
    """
    # 2024-26-11: Added the building column to the users taable
    """ALTER TABLE users
                    ADD building VARCHAR(7);
    """

    """CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    itemType VARCHAR(10) NOT NULL,
    LocationFound VARCHAR(255),
    itemDescription TEXT,
    dateFound DATE NOT NULL,
    LFlocation VARCHAR(50) NOT NULL,
    FOREIGN KEY (LFlocation) REFERENCES building (buildingCode) ON DELETE CASCADE
    );
    """

    #2024-03-12: Added an image column to the items table
    """ALTER TABLE items
    ADD COLUMN image_path VARCHAR(255);
    """
    # Execute the SQL to apply the change
    cursor.execute("""SELECT image_path FROM items WHERE LFlocation = 'SEM';
    """)
    # Commit changes and close
    conn.commit()
    cursor.close()
    conn.close()
    print("Database changes applied successfully.")

# Main function
if __name__ == "__main__":
    # Call the function to show the PostgreSQL config file location
    show_config_file()

    # Apply database changes if needed
    apply_changes()
