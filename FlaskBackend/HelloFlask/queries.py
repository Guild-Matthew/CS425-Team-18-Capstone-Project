# Guilherme Cassiano, Shane Petree

import psycopg2
from psycopg2 import sql
from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv
from dotenv import load_dotenv

# load env variables
load_dotenv('.env')

class Queries:
    def __init__(self):
        # Initialize the connection to the database
        self.conn = psycopg2.connect(
            dbname="testdb", 
            user="postgres",
            password=getenv("DATABASE_PASSWORD"),
            host="localhost",
            port="5432"
        )
        self.cursor = self.conn.cursor()


    def close(self):
        # Close the database connection
        self.cursor.close()
        self.conn.close()

    # Query to insert an item into the "items" table
    def insert_item(self, itemType, LocationFound, itemDescription, dateFound, LFlocation, subcategory, fid=None, rid=None, performed_by="system"):
        insert_query = """
            INSERT INTO items (itemType, LocationFound, itemDescription, dateFound, LFlocation, subcategory, fid, rid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        print(itemType, LocationFound, itemDescription, dateFound, LFlocation, subcategory, fid, rid)
        self.cursor.execute(insert_query, (itemType, LocationFound, itemDescription, dateFound, LFlocation, subcategory, fid, rid))
        self.conn.commit()

        log_query = """
            INSERT INTO operationslogitems (actiontype, itemtype, locationfound, description, datefound, performedby, lflocation, subcategory)
            VALUES ('INSERT', %s, %s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(log_query, (itemType, LocationFound, itemDescription, dateFound, performed_by, LFlocation, subcategory))
        self.conn.commit()

    # Query to insert an item into the "Claimed items" table
    def insert_Claimed_item(self, itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation, subcategory, fid=None, rid=None):
        query = """
            INSERT INTO claimedItems 
            (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation, subcategory, fid, rid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
        self.cursor.execute(query, (itemType, LocationFound, itemDescription, dateFound, dateClaimed, LFlocation, subcategory, fid, rid))
        self.conn.commit()

    # Query to get items from the "items" table
    def get_items(self, LFlocation, order, floor=None, room=None):
        query = """
            SELECT i.itemType, i.subcategory, i.LocationFound, i.itemDescription, i.dateFound, r.roomnumber, r.floornumber
            FROM items i
            LEFT JOIN rooms r ON i.rid = r.rid
            WHERE i.LFlocation = %s
        """
        params = [LFlocation]
        if floor:
            query += """
                AND i.fid = (
                    SELECT fid FROM floors
                    WHERE floornumber = %s AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
                )
            """
            params.extend([floor, LFlocation])
        if room:
            query += " AND r.roomnumber = %s"
            params.append(room)
        query += f" ORDER BY i.dateFound {order}"
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    # Query to get filtered items from the "items" table
    def get_items_by_type(self, item_type, building, order, floor=None, room=None, subtype=None):
        query = """
            SELECT i.itemType, i.subcategory, i.LocationFound, i.itemDescription, i.dateFound, r.roomnumber, r.floornumber
            FROM items i
            LEFT JOIN rooms r ON i.rid = r.rid
            WHERE i.itemType = %s AND i.LFlocation = %s
        """
        params = [item_type, building]

        if subtype and subtype != 'all':
            query += " AND i.subcategory = %s"
            params.append(subtype)

        if floor:
            query += """
                AND i.fid = (
                    SELECT fid FROM floors
                    WHERE floornumber = %s AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
                )
            """
            params.extend([floor, building])

        if room:
            query += " AND r.roomnumber = %s"
            params.append(room)

        query += f" ORDER BY i.dateFound {order}"
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    # Query to get items from the "Claimed items" table
    def get_Claimed_items(self, LFlocation, order, floor=None, room=None):
        query = f"""
            SELECT i.itemType, i.subcategory, i.LocationFound, i.itemDescription, i.dateFound, i.dateClaimed, r.roomnumber, r.floornumber
            FROM claimedItems i
            LEFT JOIN rooms r ON i.rid = r.rid
            WHERE i.lflocation = %s
        """
        params = [LFlocation]
        if floor:
            query += """
                AND i.fid = (
                    SELECT fid FROM floors
                    WHERE floornumber = %s AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
                )
            """
            params.extend([floor, LFlocation])
        if room:
            query += " AND r.roomnumber = %s"
            params.append(room)
        query += f" ORDER BY i.dateClaimed {order}"
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    # Query to get filtered items from the "Claimed items" table
    def get_Claimed_items_by_type(self, item_type, LFlocation, order, floor=None, room=None, subtype=None):
        query = f"""
            SELECT i.itemType, i.subcategory, i.LocationFound, i.itemDescription, i.dateFound, i.dateClaimed, r.roomnumber, r.floornumber
            FROM claimedItems i
            LEFT JOIN rooms r ON i.rid = r.rid
            WHERE i.lflocation = %s AND i.itemType = %s
        """
        params = [LFlocation, item_type]

        if subtype and subtype != 'all':
            query += " AND i.subcategory = %s"
            params.append(subtype)

        if floor:
            query += """
                AND i.fid = (
                    SELECT fid FROM floors
                    WHERE floornumber = %s AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
                )
            """
            params.extend([floor, LFlocation])
        if room:
            query += " AND r.roomnumber = %s"
            params.append(room)
        query += f" ORDER BY i.dateClaimed {order}"
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

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

    # query to get all values of a user
    def getUserAll(self, username):
        self.cursor.execute("""
        SELECT uid, username, password, email, role, active, authtoken
        FROM users 
        WHERE username = %s
        """, (username,))
        row = self.cursor.fetchone()
        if row:
            # Convert rows to a list of dictionaries
            return {"uid": row[0], "username": row[1], "password": row[2], "email": row[3], "role": row[4], "active": row[5], "authtoken": row[6]}
        return None

    # query lets the user change/reset their password
    def updateUserPassword(self, uid, password):
        query = """
            UPDATE users
            SET password = %s
            WHERE uid = %s
        """
        self.cursor.execute(query, (password, uid))
        self.conn.commit()

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


    def getUserVoidFiltered(self, uid_list, roles, active):  
        if not uid_list:
            return "none"

        placeholders = ', '.join(['%s'] * len(uid_list))

        if isinstance(roles, list):
            role_placeholders = ', '.join(['%s'] * len(roles))
            query = f"""
                SELECT uid, username, email, active, role
                FROM users 
                WHERE uid IN ({placeholders}) AND role IN ({role_placeholders}) AND active = %s
            """
            self.cursor.execute(query, tuple(uid_list) + tuple(roles) + (active,))
        else:
            query = f"""
                SELECT uid, username, email, active, role
                FROM users 
                WHERE uid IN ({placeholders}) AND role = %s AND active = %s
            """
            self.cursor.execute(query, tuple(uid_list) + (roles,) + (active,))
        rows = self.cursor.fetchall()

        if not rows: 
            return "none"

        return [
            {"id": row[0], "username": row[1], "email": row[2], "active": row[3], "role": row[4]}
            for row in rows
        ]

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

    # Query to create an account (admin or user)
    def createAccount(self, username, password, email, role):
        query = """
            INSERT INTO users (username, password, email, role)
            VALUES (%s, %s, %s, %s)
        """
        self.cursor.execute(query, (username, password, email, role))

        self.cursor.execute("""
        INSERT INTO accountlogs (actiontype, email, role)
        VALUES ('VALIDATE', %s, %s)
        """, (email,role,))
        self.conn.commit()

    # Query to deactivate an account 
    def deactivateUser(self, uid, email, role):
        self.cursor.execute("SELECT username FROM users WHERE uid = %s", (uid,))
        result = self.cursor.fetchone()
        username = result[0] if result else 'unknown'


        self.cursor.execute("UPDATE users SET active = FALSE WHERE uid = %s", (uid,))

        self.cursor.execute("""
        INSERT INTO accountlogs (actiontype, email, role)
        VALUES ('INVALIDATE', %s, %s)
        """, (email,role,))
        self.conn.commit()

    # Query to reactivate an account that already exists 
    def activateUser(self, uid, email, role):
        # Get the username for logging (optional but consistent)
        self.cursor.execute("SELECT username FROM users WHERE uid = %s", (uid,))
        result = self.cursor.fetchone()
        username = result[0] if result else 'unknown'

        # Reactivate user
        self.cursor.execute("UPDATE users SET active = TRUE WHERE uid = %s", (uid,))

        # Log the VALIDATE action
        self.cursor.execute("""
            INSERT INTO accountlogs (actiontype, email, role)
            VALUES ('REVALIDATE', %s, %s)
        """, (email, role))

        self.conn.commit()

    # Query to remove an item from the "items" table (removing an item from the L&F)
    def deleteItem(self, itemType, LocationFound, itemDescription, dateFound, LFlocation, performed_by="system"):
        delete_query = """
            DELETE FROM items
            WHERE itemType = %s AND LocationFound = %s AND itemDescription = %s AND dateFound = %s
            """
        self.cursor.execute(delete_query, (itemType, LocationFound, itemDescription, dateFound))
        self.conn.commit()

        log_query = """
            INSERT INTO operationslogitems (actiontype, itemtype, locationfound, description, datefound, performedby, LFlocation)
            VALUES ('DELETE', %s, %s, %s, %s, %s, %s)
            """

        self.cursor.execute(log_query, (itemType, LocationFound, itemDescription, dateFound, performed_by, LFlocation))
        self.conn.commit()

    def updateUserToken(self, uid, token):
        query = """
            UPDATE users
            SET authtoken = %s
            WHERE uid = %s
        """
        self.cursor.execute(query, (token, uid))
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

    def get_operation_logs_by_buildings(self, buildings, date_str=None):
        if not buildings:
            return []
        placeholders = ', '.join(['%s'] * len(buildings))
        query = f"""
            SELECT * FROM operationslogitems
            WHERE lflocation IN ({placeholders})
        """
        params = buildings
        if date_str:
            query += " AND DATE(dateperformed) = %s"
            params += [date_str]
        query += " ORDER BY dateperformed DESC"

        self.cursor.execute(query, params)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_operation_logs_by_type_and_buildings(self, action_type, buildings, date_str=None):
        if not buildings:
            return []
        placeholders = ', '.join(['%s'] * len(buildings))
        query = f"""
            SELECT * FROM operationslogitems
            WHERE actiontype = %s AND lflocation IN ({placeholders})
        """
        params = [action_type] + buildings
        if date_str:
            query += " AND DATE(dateperformed) = %s"
            params += [date_str]
        query += " ORDER BY dateperformed DESC"

        self.cursor.execute(query, params)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]


    def get_fid(self, bid, floornumber):
        query = """
            SELECT fid FROM floors
            WHERE bid = %s AND floornumber = %s
        """
        self.cursor.execute(query, (bid, floornumber))
        row = self.cursor.fetchone()
        return row[0] if row else None

    def get_rid(self, bid, roomnumber=None, floornumber=None):
        query = "SELECT rid FROM rooms WHERE bid = %s"
        params = [bid]

        if roomnumber:
            query += " AND roomnumber = %s"
            params.append(int(roomnumber))

        if floornumber:
            query += " AND floornumber = %s"
            params.append(int(floornumber))

        self.cursor.execute(query, tuple(params))
        result = self.cursor.fetchone()
        return result[0] if result else None


    def getFloorID(self, buildingcode, floor):
        query = """
            SELECT fid FROM floors 
            WHERE floornumber = %s 
            AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
        """
        self.cursor.execute(query, (floor, buildingcode))
        result = self.cursor.fetchone()
        return result[0] if result else None

    def getRoomID(self, buildingcode, floor, room):
        query = """
            SELECT rid FROM rooms 
            WHERE roomnumber = %s 
            AND floornumber = %s
            AND bid = (SELECT bid FROM building WHERE buildingcode = %s)
        """
        self.cursor.execute(query, (room, floor, buildingcode))
        result = self.cursor.fetchone()
        return result[0] if result else None

    def get_account_logs(self):
        query = """
            SELECT actiontype, email, dateperformed, role
            FROM accountlogs
            ORDER BY dateperformed DESC
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_account_logsADM(self):
        query = """
            SELECT actiontype, email, dateperformed, role
            FROM accountlogs
            WHERE role = 'student'
            ORDER BY dateperformed DESC
        """
        self.cursor.execute(query)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    def getRoleFromUID(self, uid):
        self.cursor.execute("""
        SELECT role
        FROM users 
        WHERE uid = %s
        """, (uid,))
        row = self.cursor.fetchone()
        if row:
            # Convert rows to a list of dictionaries
            return {"role": row[0]}  
        return None

    def getAllUserIDs(self):
        self.cursor.execute("SELECT uid FROM users WHERE active = 'TRUE'")
        return [row[0] for row in self.cursor.fetchall()]

    def getAllStudentIDs(self):
        self.cursor.execute("SELECT uid FROM users WHERE role = 'student' AND active = 'TRUE'")
        return [row[0] for row in self.cursor.fetchall()]

    def getEmailFromUID(self, uid):
        try:
            uid = int(uid)
            self.cursor.execute("SELECT email FROM users WHERE uid = %s", (uid,))
            row = self.cursor.fetchone()
            return {"email": row[0]} if row else None
        except Exception as e:
            print(f"Error in getEmailFromUID for uid={uid}: {e}")
            return None

    def getBuildingNameFromBID(self, bid):
        self.cursor.execute("""
            SELECT buildingcode FROM building WHERE bid = %s
        """, (bid,))
        row = self.cursor.fetchone()
        return row[0] if row else None

    def clearPermissionsForUser(self, uid):
        self.cursor.execute("""
            DELETE FROM permissions WHERE uid = %s
        """, (uid,))
        self.conn.commit()

    def getUsernameByUID(self, uid):
        self.cursor.execute("""
            SELECT username FROM users WHERE uid = %s
        """, (uid,))
        result = self.cursor.fetchone()
        return result[0] if result else 'unknown'


if __name__ == "__main__":
    # Create an instance of Queries
    db_queries = Queries()
    
    # Close the database connection
    db_queries.close()


