# This file was implemented by Guilherme Domingues Cassiano 
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

    # Query to insert an item into the "items" table
    def insert_item(self, itemType, LocationFound, itemDescription, dateFound, LFlocation,  image_path): #*
        query = """
        INSERT INTO items (itemType, LocationFound, itemDescription, dateFound, LFlocation, image_path)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, LFlocation,  image_path))
        self.conn.commit()

    # Query to insert an item into the "Claimed items" table
    def insert_Claimed_item(self, itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation):#*
        query = """
        INSERT INTO claimedItems (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation))
        self.conn.commit()

    # Query to get items from the "items" table
    def get_items(self, LFlocation, order):#*
        # Validate the order argument to ensure it's either ASC or DESC
        if order not in ("ASC", "DESC"):
            raise ValueError("Invalid order. Must be 'ASC' or 'DESC'.")       
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, image_path
        FROM items 
        WHERE LFlocation = %s
        ORDER BY dateFound {order}
        """
        self.cursor.execute(query, (LFlocation,))  
        return self.cursor.fetchall()  # Fetch all matching items

    # Query to get filtered items from the "items" table
    def get_items_by_type(self, item_type, building, order):#*
        # Validate the order argument to ensure it's either ASC or DESC
        if order not in ("ASC", "DESC"):
            raise ValueError("Invalid order. Must be 'ASC' or 'DESC'.")
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, image_path
        FROM items
        WHERE itemType = %s AND lflocation = %s
        ORDER BY dateFound {order}
        """
        self.cursor.execute(query, (item_type, building))
        return self.cursor.fetchall()

    # Query to get items from the "Claimed items" table
    def get_Claimed_items(self, LFlocation, order): #*
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed  
        FROM claimedItems 
        WHERE lflocation = %s 
        ORDER BY dateClaimed {order}
        """
        self.cursor.execute(query, (LFlocation,))
        return self.cursor.fetchall()  # Fetch all matching items

    # Query to get filtered items from the "Claimed items" table
    def get_Claimed_items_by_type(self, LFlocation, item_type, order): #*
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed  
        FROM claimedItems 
        WHERE lflocation = %s AND itemType = %s
        ORDER BY dateClaimed {order}
        """
        self.cursor.execute(query, (LFlocation, item_type))
        return self.cursor.fetchall()  # Fetch all matching items

    # Query to create an account (admin or user)
    def createAccount(self, username, password, email, role, building=None): #*
        query = """
            INSERT INTO users (username, password, email, role, building)
            VALUES (%s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (username, password, email, role, building))
        self.conn.commit()
        
    # Query to check if user exists when logging in 
    def getUser(self, username, email): #*
        self.cursor.execute("""
        SELECT id, username, password, role, building 
        FROM users 
        WHERE username = %s OR email = %s
        """, (username, email))
        row = self.cursor.fetchone()
        if row:
            return {"id": row[0], "username": row[1], "password": row[2], "role": row[3], "building": row[4]}  # Convert to dictionary
        return None

    # Query to get all users for the "void" user page (page where an admin can delete normal user accounts)
    def getUserVoid(self, role): #*
        self.cursor.execute("""
        SELECT username, email, building
        FROM users 
        WHERE role = %s
        """, (role,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1], "building": row[2]} for row in rows]  

    # Query to get all users for the "void" user page (page where an admin can delete normal user accounts) by the building they work  
    def getUserVoidFiltered(self, building, role): #*
        self.cursor.execute("""
        SELECT username, email
        FROM users 
        WHERE building = %s AND role = %s
        """, (building, role,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1]} for row in rows]  

    # Query to remove an account 
    def deleteUser(self, email, username):
        query = """
        DELETE FROM users
        WHERE username = %s AND email = %s
        """
        self.cursor.execute(query, (username, email))
        self.conn.commit()

    # Query to remove an item from the "items" table (removing an item from the L&F)
    def deleteItem(self, itemType, LocationFound, itemDescription, dateFound):#*
        query = """
        DELETE FROM items
        WHERE itemType = %s AND LocationFound = %s AND dateFound = %s AND itemDescription = %s
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound))
        self.conn.commit()
        
    # Query to create a new building to be displayed on the map
    def createBuilding(self, buildingCode, latitude, longitude):#*
        query = """
            INSERT INTO building (buildingCode, latitude, longitude)
            VALUES (%s, %s, %s)
        """
        self.cursor.execute(query, (buildingCode, latitude, longitude))
        self.conn.commit()

    # Query to get the buildings to be displayed on the map 
    def getBuildings(self):
        query = """
        SELECT b.buildingCode, b.latitude, b.longitude, COUNT(i.id) as itemCount, COUNT(c.id) as claimedCount
        FROM building b
        LEFT JOIN items i ON b.buildingCode = i.LFlocation
        LEFT JOIN claimedItems c ON b.buildingCode = c.LFlocation
        GROUP BY b.buildingCode, b.latitude, b.longitude
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        return [{'buildingCode': row[0], 'latitude': row[1], 'longitude': row[2], 'itemCount': row[3], 'claimedCount': row[4]} for row in rows]


# This function is not always called, I only use it when I have to call a specific query manually (add building, create admin role account etc)
if __name__ == "__main__":
    db_queries = Queries()
    hashed_password = generate_password_hash('Dovakhin12#')
    items = db_queries.createAccount('gcassianoADM', hashed_password,'gcassianoADM@unr.edu', 'admin')
    db_queries.close()
