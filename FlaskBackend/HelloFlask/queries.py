# Guilherme Cassiano
import psycopg2
from psycopg2 import sql
from werkzeug.security import generate_password_hash, check_password_hash
class Queries:
    def __init__(self):
        # Initialize the connection to the database
        self.conn = psycopg2.connect(
            dbname="testdb", 
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
    def insert_item(self, itemType, LocationFound, itemDescription, dateFound, LFlocation, image_path, performed_by="system"):
        # Insert the item
        insert_query = """
            INSERT INTO items (itemType, LocationFound, itemDescription, dateFound, LFlocation, image_path)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(insert_query, (itemType, LocationFound, itemDescription, dateFound, LFlocation, image_path))
        self.conn.commit()

        # Log the operation
        log_query = """
            INSERT INTO operationslogitems (actiontype, itemtype, locationfound, description, datefound, performedby)
            VALUES ('INSERT', %s, %s, %s, %s, %s)
        """
        self.cursor.execute(log_query, (itemType, LocationFound, itemDescription, dateFound, performed_by))
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
        self.cursor.execute(query, (LFlocation,))  # Pass LFlocation as a tuple
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
    def createAccount(self, username, password, email, role): #*
        query = """
            INSERT INTO users (username, password, email, role)
            VALUES (%s, %s, %s, %s)
        """
        self.cursor.execute(query, (username, password, email, role))
        self.conn.commit()

    def updateUserToken(self, uid, token):
        query = """
            UPDATE users
            SET authtoken = %s
            WHERE uid = %s
        """
        self.cursor.execute(query, (token, uid))
        self.conn.commit()

    # Query to check if user exists when logging in 
    def getUser(self, username): # Only use username, remove email
        self.cursor.execute("""
        SELECT uid, username, password, role, active 
        FROM users 
        WHERE username = %s
        """, (username,))
        row = self.cursor.fetchone()
        if row:
            # Convert rows to a list of dictionaries
            return {"uid": row[0], "username": row[1], "password": row[2], "role": row[3], "active": row[4]}  
        return None


    # Query to get all users for the "void" user page
    def getUserVoid(self, role, active): #*
        self.cursor.execute("""
        SELECT username, email
        FROM users 
        WHERE role = %s AND active = %s
        """, (role,active,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1]} for row in rows]  


    def getUserVoidSuper(self, role, role2, active): #*
        self.cursor.execute("""
        SELECT username, email, active, role
        FROM users 
        WHERE active = %s AND role = %s OR role = %s
        """, (active,role,role2,))
        rows = self.cursor.fetchall()
        return [{"username": row[0], "email": row[1], "active": row[2], "role": row[3]} for row in rows] 


    def getUserVoidFiltered(self, uid_list, role, active):  
        if not uid_list: 
            return "none"  
        placeholders = ', '.join(['%s'] * len(uid_list))  
        query = f"""
            SELECT username, email, active, role
            FROM users 
            WHERE uid IN ({placeholders}) AND role = %s AND active = %s
        """
        self.cursor.execute(query, tuple(uid_list) + (role,) + (active,))  
        rows = self.cursor.fetchall()
        if not rows: 
            return "none"
        return [{"username": row[0], "email": row[1], "active": row[2], "role": row[3]} for row in rows]

    #task this function throws an error when changing the building in the dropdown on super admin deactivate account page
    def getUserVoidFilteredSuper(self, uid_list, role, role2, active):  
        if not uid_list: 
            return "none"  
        placeholders = ', '.join(['%s'] * len(uid_list))  #creates a list of %s based on how many accounts are in the uid_list 
        query = f"""
            SELECT username, email, active, role
            FROM users 
            WHERE uid IN ({placeholders}) AND active = %s
        """
        self.cursor.execute(query, tuple(uid_list) + (active,) + (role,) + (role2,) )  
        rows = self.cursor.fetchall()
        if not rows: 
            return "none"
        return [{"username": row[0], "email": row[1], "active": row[2], "role": row[3]} for row in rows] 
 
    # Query to deactivate an account 
    def deactivateUser(self, email, username):
        query = """
        UPDATE users
        SET active = FALSE
        WHERE email = %s AND username = %s
        """
        self.cursor.execute(query, (email, username))  
        self.conn.commit()

    # Query to reactivate an account that already exists 
    def activateUser(self, email, username):
        query = """
        UPDATE users
        SET active = TRUE
        WHERE email = %s AND username = %s
        """
        self.cursor.execute(query, (email, username))  
        self.conn.commit()

    # Query to remove an item from the "items" table (removing an item from the L&F)
    def deleteItem(self, itemType, LocationFound, itemDescription, dateFound, performed_by="system"):
        # Fetch the item before deletion (optional, but ensures it exists)
        fetch_query = """
            SELECT itemType, LocationFound, itemDescription, dateFound
            FROM items
            WHERE itemType = %s AND LocationFound = %s AND dateFound = %s AND itemDescription = %s
        """
        self.cursor.execute(fetch_query, (itemType, LocationFound, dateFound, itemDescription))
        item = self.cursor.fetchone()

        if item:
            # Perform deletion
            delete_query = """
                DELETE FROM items
                WHERE itemType = %s AND LocationFound = %s AND dateFound = %s AND itemDescription = %s
            """
            self.cursor.execute(delete_query, (itemType, LocationFound, dateFound, itemDescription))
            self.conn.commit()

            # Log deletion
            log_query = """
                INSERT INTO operations_log operationslogitems (actiontype, itemtype, locationfound, description, datefound, performedby)
                VALUES ('DELETE', %s, %s, %s, %s, %s)
            """
            self.cursor.execute(log_query, (itemType, LocationFound, itemDescription, dateFound, performed_by))
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
        return [row[0] for row in rows]

    def getAllBuildings(self):
        self.cursor.execute("""
        SELECT buildingcode
        FROM building
        """)
        rows = self.cursor.fetchall()
        return [row[0] for row in rows] 

    def addFloor(self, bid, floornumber):
        query = """
            INSERT INTO floors (bid, floornumber)
            VALUES (%s, %s)
        """
        self.cursor.execute(query, (bid, floornumber))
        self.conn.commit()

    def removeFloor(self, bid, floorNumber):
        query = """
            DELETE FROM floors 
            WHERE bid = %s AND floornumber = %s
        """
        self.cursor.execute(query, (bid, floorNumber))
        self.conn.commit()

    def getNumberofFloors(self, bid):
        query = """
            SELECT COUNT(bid)
            FROM floors
            WHERE bid = %s
        """
        self.cursor.execute(query, (bid,))
        result = self.cursor.fetchone()  
        return result[0] if result else 0  

    def getFloors(self, bid):
        query = """
            SELECT floornumber
            FROM floors
            WHERE bid = %s
        """
        self.cursor.execute(query, (bid,))  
        rows = self.cursor.fetchall() 
        return [row[0] for row in rows] 

    def getRooms(self, bid, floornumber):
        query = """
            SELECT roomnumber
            FROM rooms
            WHERE bid = %s AND floornumber = %s
        """
        self.cursor.execute(query, (bid,floornumber,))  
        rows = self.cursor.fetchall() 
        return [row[0] for row in rows] 

    def addRoom(self,bid,roomnumber, floornumber):
        query = """
            INSERT INTO rooms (bid, roomnumber, floornumber)
            VALUES (%s, %s, %s)
        """
        self.cursor.execute(query, (bid, roomnumber, floornumber))
        self.conn.commit()

    def removeRoom(self, bid, roomNumber):
        query = """
            DELETE FROM rooms 
            WHERE bid = %s AND roomNumber = %s
        """
        self.cursor.execute(query, (bid, roomNumber))
        self.conn.commit()

    def getUsersFromPermissions(self, bid):
        self.cursor.execute("""
        SELECT uid
        FROM Permissions
        WHERE bid = %s
        """, (bid,))
        rows = self.cursor.fetchall()
        return [row[0] for row in rows]

    def getTokenByUID(self, uid):
        self.cursor.execute("""
        SELECT authtoken
        FROM users
        WHERE uid = %s
        """, (uid,))
        row = self.cursor.fetchone()
        return [row[0] if row else None]

    def removeAuthToken(self, UID):
        query = """
            UPDATE users
            SET authtoken = NULL
            WHERE uid = %s
        """
        self.cursor.execute(query, (UID,))
        self.conn.commit()

    def getBuildingCoordinates(self):
        query = """
            SELECT buildingcode, latitude, longitude
            FROM building
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        return [{'buildingcode': row[0], 'latitude': row[1], 'longitude':row[2]} for row in rows]

    def get_operation_logs(self):
        query = """
            SELECT actiontype, itemtype, locationfound, description, datefound, performedby, dateperformed
            FROM operationslogitems
            ORDER BY dateperformed DESC
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_operation_logs_by_type(self, action_type):
        query = """
            SELECT actiontype, itemtype, locationfound, description, datefound, performedby, dateperformed
            FROM operationslogitems
            WHERE actiontype = %s
            ORDER BY dateperformed DESC
        """
        self.cursor.execute(query, (action_type,))
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]




if __name__ == "__main__":
    # Create an instance of Queries
    db_queries = Queries()
    
    

    
    # Close the database connection
    db_queries.close()


