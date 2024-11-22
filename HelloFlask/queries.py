import psycopg2
from psycopg2 import sql
from werkzeug.security import generate_password_hash, check_password_hash
class Queries:
    def __init__(self):
        # Initialize the connection to the database
        self.conn = psycopg2.connect(
            dbname="TestDB",
            user="postgres",
            password="#aH6TR5fkcdx99",
            host="localhost",
            port="5432"
        )
        self.cursor = self.conn.cursor()


    def close(self):
        # Close the database connection
        self.cursor.close()
        self.conn.close()

    def insert_item(self, itemType, LocationFound, itemDescription, dateFound, LFlocation): #*
        query = """
        INSERT INTO items (itemType, LocationFound, itemDescription, dateFound, LFlocation)
        VALUES (%s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, LFlocation))
        self.conn.commit()

    def insert_Claimed_item(self, itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation):#*
        query = """
        INSERT INTO claimedItems (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation))
        self.conn.commit()


    def get_items(self, LFlocation):#*
        self.cursor.execute("""
        SELECT itemType, LocationFound, itemDescription, dateFound 
        FROM items 
        WHERE LFlocation = %s
        """, (LFlocation,))  # Pass LFlocation as a tuple
        return self.cursor.fetchall()  # Fetch all matching items

    def get_items_by_type(self, item_type):#*
        query = """
        SELECT itemType, LocationFound, itemDescription, dateFound 
        FROM items
        WHERE itemType = %s
        """
        self.cursor.execute(query, (item_type,))
        return self.cursor.fetchall()

    def get_Claimed_items(self, LFlocation): #*
        self.cursor.execute("""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed 
        FROM claimedItems 
        WHERE LFlocation = %s
        """,(LFlocation,))
        return self.cursor.fetchall()  # Fetch all matching items

    def get_Claimed_items_by_type(self): #*
        self.cursor.execute("""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed  
        FROM claimedItems 
        WHERE itemType = %s
        """,)
        return self.cursor.fetchall()  # Fetch all matching items

    def createAccount(self, username, password, email, role): #*
        query = """
            INSERT INTO users (username, password, email, role)
            VALUES (%s, %s, %s, %s)
        """
        self.cursor.execute(query, (username, password, email, role))
        self.conn.commit()

    def getUser(self, username, email): #*
        self.cursor.execute("""
        SELECT id, username, password, role 
        FROM users 
        WHERE username = %s OR email = %s
        """, (username, email))
        row = self.cursor.fetchone()
        if row:
            return {"id": row[0], "username": row[1], "password": row[2], "role": row[3]}  # Convert to dictionary
        return None

    def deleteItem(self, itemType, LocationFound, itemDescription, dateFound):#*
        query = """
        DELETE FROM items
        WHERE itemType = %s AND LocationFound = %s AND dateFound = %s AND itemDescription = %s
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound))
        self.conn.commit()

    def createBuilding(self, buildingCode, latitude, longitude):#*
        query = """
            INSERT INTO building (buildingCode, latitude, longitude)
            VALUES (%s, %s, %s)
        """
        self.cursor.execute(query, (buildingCode, latitude, longitude))
        self.conn.commit()

    def getBuildings(self):
        query = """
        SELECT buildingCode, latitude, longitude FROM building
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        # Convert rows to a list of dictionaries
        return [{'buildingCode': row[0], 'latitude': row[1], 'longitude': row[2]} for row in rows]

if __name__ == "__main__":
    # Create an instance of Queries
    db_queries = Queries()
    hashed_password = generate_password_hash('Dovakhin12#')
    # Fetch all items in the database
    items = db_queries.getUser('cguilherme', 'cguilherme@unr.edu')
    
    # Close the database connection
    db_queries.close()
