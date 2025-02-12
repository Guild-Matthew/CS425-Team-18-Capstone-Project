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

    def insert_item(self, itemType, LocationFound, itemDescription, dateFound, LFlocation,  image_path): #*
        query = """
        INSERT INTO items (itemType, LocationFound, itemDescription, dateFound, LFlocation, image_path)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, LFlocation,  image_path))
        self.conn.commit()

    def insert_Claimed_item(self, itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation):#*
        query = """
        INSERT INTO claimedItems (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation))
        self.conn.commit()


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
        self.cursor.execute(query, (LFlocation,))  # Pass LFlocation as a tuple
        return self.cursor.fetchall()  # Fetch all matching items

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

    def get_Claimed_items(self, LFlocation, order): #*
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed  
        FROM claimedItems 
        WHERE lflocation = %s 
        ORDER BY dateClaimed {order}
        """
        self.cursor.execute(query, (LFlocation,))
        return self.cursor.fetchall()  # Fetch all matching items

    def get_Claimed_items_by_type(self, LFlocation, item_type, order): #*
        query = f"""
        SELECT itemType, LocationFound, itemDescription, dateFound, dateClaimed  
        FROM claimedItems 
        WHERE lflocation = %s AND itemType = %s
        ORDER BY dateClaimed {order}
        """
        self.cursor.execute(query, (LFlocation, item_type))
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
        SELECT uid, username, password, role 
        FROM users 
        WHERE username = %s OR email = %s
        """, (username, email))
        row = self.cursor.fetchone()
        if row:
            return {"id": row[0], "username": row[1], "password": row[2], "role": row[3]}  # Convert to dictionary
        return None


    def getUserVoid(self, role): #*
        self.cursor.execute("""
        SELECT username, email
        FROM users 
        WHERE role = %s
        """, (role,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1]} for row in rows]  

    def getUserVoidFiltered(self, building, role): #*
        self.cursor.execute("""
        SELECT username, email
        FROM users 
        WHERE building = %s AND role = %s
        """, (building, role,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1]} for row in rows]  

    def deleteUser(self, email, username):
        query = """
        DELETE FROM users
        WHERE username = %s AND email = %s
        """
        self.cursor.execute(query, (username, email))
        self.conn.commit()

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
        SELECT b.buildingCode, b.latitude, b.longitude, COUNT(i.id) as itemCount, COUNT(c.id) as claimedCount
        FROM building b
        LEFT JOIN items i ON b.buildingCode = i.LFlocation
        LEFT JOIN claimedItems c ON b.buildingCode = c.LFlocation
        GROUP BY b.buildingCode, b.latitude, b.longitude
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        # Convert rows to a list of dictionaries
        return [{'buildingCode': row[0], 'latitude': row[1], 'longitude': row[2], 'itemCount': row[3], 'claimedCount': row[4]} for row in rows]

    def getBuildingsSubmitItem(self):
        query = """
        SELECT buildingcode FROM building
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        return [row[0] for row in rows]

    def getUserId(self, username):
        self.cursor.execute("""
        SELECT uid
        FROM users
        WHERE username = %s
        """, (username,))
        row = self.cursor.fetchone() 
        return row[0] if row else None  

    def getBuildingID(self, building):
        self.cursor.execute("""
        SELECT bid
        FROM building
        WHERE buildingcode = %s
        """, (building,))
        row = self.cursor.fetchone() 
        return row[0] if row else None 

    def createPermissions(self, bid, uid):
        query = """
            INSERT into Permissions (bid, uid)
            VALUES (%s, %s)
        """
        self.cursor.execute(query, (bid, uid))
        self.conn.commit()

    def getBuildingsFromPermissions(self, uid):
        self.cursor.execute("""
        SELECT b.buildingcode
        FROM Permissions p
        JOIN building b ON p.bid = b.bid
        WHERE p.uid = %s
        """, (uid,))
    
        rows = self.cursor.fetchall()
        return [row[0] for row in rows]  # Return list of building codes

if __name__ == "__main__":
    # Create an instance of Queries
    db_queries = Queries()
    
    # Call the method and store the result
    buildings = db_queries.getBuildingsFromPermissions('59')
    
    # Print the result
    print(buildings)
    
    # Close the database connection
    db_queries.close()
