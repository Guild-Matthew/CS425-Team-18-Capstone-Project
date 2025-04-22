# This file was implemented by Guilherme Domingues Cassiano
# A section by Shane Petree
from flask import render_template, request, redirect, url_for, Blueprint, jsonify, session, current_app, Flask
from HelloFlask.queries import Queries
from datetime import datetime 
import os
import numpy as np
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
# Create an instance of the Queries class for database operations
db_queries = Queries()
main_bp = Blueprint('main', __name__)

@main_bp.route('/ItemOperationLogs', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_operation_logs():
    user_id = request.args.get('user_id')
    role = request.args.get('role')
    token = request.args.get('token')
    filter_type = request.args.get('filterType', None)
    print("ROLE: ", role)
    print("USERID: ", user_id)
    # Verify token
    uidauthtoken = db_queries.getTokenByUID(user_id)
    uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
    if uidauthtoken != token:
        return jsonify({"error": "Unauthorized"}), 401

    # Get buildings user has access to
    if role == 'superadmin':
        permitted_buildings = db_queries.getAllBuildings()
    elif role in ['admin', 'student']:
        permitted_buildings = db_queries.getBuildingsFromPermissions(user_id)
        print("BUILDINGS: ", permitted_buildings)
    else:
        return jsonify({"error": "Unauthorized role"}), 403

    # Fetch logs by building permission and action type
    date_str = request.args.get('date') 
    if filter_type and filter_type.upper() in ['INSERT', 'DELETE']:
        logs = db_queries.get_operation_logs_by_type_and_buildings(filter_type.upper(), permitted_buildings, date_str)
        print("LOGS: ", logs)
    else:
        logs = db_queries.get_operation_logs_by_buildings(permitted_buildings, date_str)
        print("LOGS: ", logs)
    return jsonify(logs)

@main_bp.route('/', methods=['GET'])
def home():
    # Shane Petree
    # Clear the session on startup, so the user is logged out when they open the app
    session.clear()
    return render_template("index.html")

@main_bp.route('/api/buildings', methods=['GET'])
def get_buildings():
    buildings = db_queries.getBuildings()  # Query to fetch building data
    return jsonify(buildings)  # Return the building data as JSON


@main_bp.route('/L&F', methods=['GET'])
def info():
    filter_type = request.args.get('filterType', 'all')
    building = request.args.get('building')
    floor = request.args.get('floor')
    room = request.args.get('room')
    sort_order = request.args.get('sort', 'oldest')
    order = "ASC" if sort_order == "oldest" else "DESC"

    all_buildings_info = db_queries.getBuildingCoordinates()
    all_buildings = [b['buildingcode'] for b in all_buildings_info]

    if not building:
        building = all_buildings[0] if all_buildings else None

    if not building:
        return jsonify({"error": "No buildings available"}), 400

    current = next((b for b in all_buildings_info if b['buildingcode'] == building), None)
    if not current:
        return jsonify({"error": "Building not found"}), 400

    lat1, lon1 = current['latitude'], current['longitude']
    bid = db_queries.getBuildingID(building)
    floors = db_queries.getFloors(bid)
    rooms = db_queries.getRooms(bid, floor) if floor else []

    if not floors:
        valid_buildings = [
            b for b in all_buildings_info
            if b['buildingcode'] != building and db_queries.getFloors(db_queries.getBuildingID(b['buildingcode']))
        ]
        if not valid_buildings:
            return jsonify({"warning": f"No Lost and Found found for building '{building}', and no alternatives available."}), 400

        a = np.array([[b['latitude'], b['longitude']] for b in valid_buildings])
        b = np.array([lat1, lon1])
        idx_min = np.sum((a - b) ** 2, axis=1).argmin()
        closest_building = valid_buildings[idx_min]

        return jsonify({
            "warning": f'Building "{building}" has no Lost and Found. Closest alternative: "{closest_building["buildingcode"]}".',
            "closest_building": closest_building["buildingcode"],
            "buildings": all_buildings
        }), 400

    if filter_type == 'all':
        items = db_queries.get_items(building, order, floor, room)
    else:
        items = db_queries.get_items_by_type(filter_type, building, order, floor, room)

    return jsonify({
        "items": items,
        "buildings": all_buildings,
        "selected_building": building,
        "floors": floors,
        "rooms": rooms
    })

@main_bp.route('/Items', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def Reportitems():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        role = request.form.get('role')
        formAuthToken = request.form.get('authToken')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
        if uidauthtoken != formAuthToken:
            return jsonify({"error ONE": "Unauthorized"}), 401

        item_type = request.form.get('itemType')
        location_found = request.form.get('locationFound')
        date_found = datetime.now()
        description = request.form.get('description')
        lostAndFoundLocation = request.form.get('location')  
        floor_number = request.form.get('floor')
        room_number = request.form.get('room')

        if not all([item_type, location_found, description, lostAndFoundLocation]):
            return jsonify({"error": "Missing fields"}), 400

        bid = db_queries.getBuildingID(lostAndFoundLocation)
        fid = db_queries.get_fid(bid, floor_number)
        rid = db_queries.get_rid(bid, room_number, floor_number) if room_number or floor_number else None

        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        db_queries.insert_item(
            item_type, location_found, description, date_found,
            bid, fid, rid
        )

        return jsonify({"message": "Item added successfully"}), 200

    user_id = request.args.get('user_id')  
    if not user_id:
        return jsonify({"error TWO": "Unauthorized - Missing User ID"}), 401
    role = request.args.get('role')
    if role == 'superadmin':
        buildings = db_queries.getAllBuildings()
    else:
        buildings = db_queries.getBuildingsFromPermissions(user_id)
    return jsonify({"buildings": buildings})


@main_bp.route('/remove_item', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def remove_items():
    if request.method == 'POST': 
        data = request.get_json() 
        user_id = data.get('user_id')
        role = data.get('role')
        formAuthToken = data.get('authtoken')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        item_type = data.get('itemType')
        location_found = data.get('locationFound')
        date_found = data.get('dateFound')
        description = data.get('description')
        dateClaimed = datetime.now().strftime('%Y-%m-%d %H:%M')
        lostAndFoundLocation = data.get('lfLocation')
        floor = data.get('floor')
        room = data.get('room')

        if not all([item_type, location_found, date_found, description]):
            return jsonify({"error": "Missing fields"}), 400

        bid = db_queries.getBuildingID(lostAndFoundLocation)
        fid = db_queries.get_fid(bid, floor) if floor else None
        rid = db_queries.get_rid(bid, room, floor) if room and floor else None

        db_queries.insert_Claimed_item(
            item_type, location_found, description, date_found,
            dateClaimed, bid, fid, rid
        )
        db_queries.deleteItem(item_type, location_found, description, date_found, bid)

        return jsonify({"message": "Item removed successfully"}), 200

    user_id = request.args.get('user_id')  
    role = request.args.get('role')

    if not user_id:
        return jsonify({"error": "Unauthorized - Missing User ID"}), 401

    buildings = db_queries.getBuildingsFromPermissions(user_id)
    selected_building = request.args.get('building', buildings[0] if buildings else None)
    sort_order = request.args.get('sort', 'oldest')
    order = "ASC" if sort_order == "oldest" else "DESC"
    filter_type = request.args.get('filterType', 'all')

    bid = db_queries.getBuildingID(selected_building)

    if filter_type == 'all':
        items = db_queries.get_items(bid, order)
    else:
        items = db_queries.get_items_by_type(filter_type, bid, order)

    response = {
        "items": [{"type": item[0], "location": item[1], "description": item[2], "dateFound": item[3], "lfLocation": selected_building} for item in items],
        "sort_order": sort_order,
        "filterType": filter_type,
        "buildings": buildings,
        "selected_building": selected_building
    }
    return jsonify(response)


@main_bp.route('/claimedItems', methods=['GET'])
@cross_origin(supports_credentials=True)
def ClaimedItems():
    user_id = request.args.get('user_id')  
    role = request.args.get('role')
    formAuthToken = request.args.get('token')
    floor = request.args.get("floor")
    room = request.args.get("room")

    uidauthtoken = db_queries.getTokenByUID(user_id)
    uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None

    if uidauthtoken != formAuthToken:
        return jsonify({"error": "Unauthorized"}), 401

    if role == 'superadmin':
        buildings = db_queries.getAllBuildings()
    else:
        buildings = db_queries.getBuildingsFromPermissions(user_id)
    selected_building = request.args.get('building', buildings[0] if buildings else None)
    sort_order = request.args.get('sort', 'oldest')
    order = "ASC" if sort_order == "oldest" else "DESC"
    filter_type = request.args.get('filterType', 'all')

    bid = db_queries.getBuildingID(selected_building)
    floors = db_queries.getFloors(bid)
    rooms = db_queries.getRooms(bid, floor) if floor else []

    if filter_type == 'all':
        items = db_queries.get_Claimed_items(bid, order, floor, room)
    else:
        items = db_queries.get_Claimed_items_by_type(filter_type, bid, order, floor, room)

    response = {
        "items": [{
            "type": item[0],
            "location": item[1],
            "description": item[2],
            "dateFound": item[3],
            "dateClaimed": item[4],
            "roomNumber": item[5]
        } for item in items],
        "sort_order": sort_order,
        "filterType": filter_type,
        "buildings": buildings,
        "selected_building": selected_building,
        "floors": floors,
        "rooms": rooms
    }
    return jsonify(response)


@main_bp.route('/addBuilding', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def addBuilding():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        role = request.form.get('role')
        formAuthToken = request.form.get('authtoken')
        BuildingCode = request.form.get('BuildingCode')
        Latitude = request.form.get('Latitude')
        Longitude = request.form.get('Longitude')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        if not all([BuildingCode, Latitude, Longitude]):
            return jsonify({"error": "Missing fields"}), 400

        # Save to Database
        db_queries.createBuilding(BuildingCode, Latitude, Longitude)

        return jsonify({"message": "Building added successfully!"}), 200

# to edit and fetch floors of a building
@main_bp.route('/editBuilding', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def EditBuilding():
        user_id = request.args.get('user_id')  
        print(user_id)
        role = request.args.get('role')
        formAuthToken = request.args.get('token')
        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None

        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        buildings = db_queries.getBuildingsFromPermissions(user_id)
        if request.method == 'POST':
            selected_building = request.form.get('selected_building', buildings[0] if buildings else None)
        else:
            selected_building = request.args.get('selected_building', buildings[0] if buildings else None)

        # Fetch floors for the selected building
        bid = db_queries.getBuildingID(selected_building)
        floors = db_queries.getFloors(bid)  

        if request.method == 'POST':
            action = request.form.get('action') 
            if action == 'add_floor':
                user_id = request.form.get('user_id')
                role = request.form.get('role')
                floorNumber = request.form['floorNumber']
                db_queries.addFloor(bid, floorNumber)
                floors = db_queries.getFloors(bid)
            elif action == 'remove_floor':
                user_id = request.form.get('user_id')
                role = request.form.get('role')
                floor_number = request.form.get('floor_number') 
                db_queries.removeFloor(bid, floor_number)
                floors = db_queries.getFloors(bid)


        if role == 'superadmin':
            buildingsPermissions = db_queries.getAllBuildings()
        elif role == 'admin':
            buildingsPermissions = db_queries.getBuildingsFromPermissions(user_id)
        return jsonify({
            "buildings": buildingsPermissions,
            "selected_building": selected_building,
            "floors": floors
        })

# to edit and fetch rooms of a floor of a building
@main_bp.route('/editFloor', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def EditFloor():
    user_id = request.args.get('user_id')
    print(user_id)
    role = request.args.get('role')
    formAuthToken = request.args.get('token')
    uidauthtoken = db_queries.getTokenByUID(user_id)
    uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None

    # return error if user does not have an active session authtoken
    if uidauthtoken != formAuthToken:
        return jsonify({"error": "Unauthorized"}), 401

    buildingsPermissions = []

    # get buildings based off user role
    if role == 'superadmin':
        buildingsPermissions = db_queries.getAllBuildings()
    elif role == 'admin':
        buildingsPermissions = db_queries.getBuildingsFromPermissions(user_id)

    if request.method == 'POST':
        selected_building = request.form.get('selected_building', buildingsPermissions[0] if buildingsPermissions else None)
    else:
        selected_building = request.args.get('selected_building', buildingsPermissions[0] if buildingsPermissions else None)

    # Fetch floors for the selected building
    bid = db_queries.getBuildingID(selected_building)
    floors = db_queries.getFloors(bid)

    if request.method == 'POST':
        selected_floor = request.form.get('selected_floor', floors[0] if floors else None)
    else:
        selected_floor = request.args.get('selected_floor', floors[0] if floors else None)

    # fetch rooms for the selected building and floor
    rooms = db_queries.getRooms(bid, selected_floor)

    if request.method == 'POST':
        selected_room = request.form.get('selected_room', rooms[0] if rooms else None)
    else:
        selected_room = request.args.get('selected_room', rooms[0] if rooms else None)

    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add_room':
            db_queries.addRoom(bid, selected_room, selected_floor)
            rooms = db_queries.getRooms(bid, selected_floor)
        elif action == 'remove_room':
            db_queries.removeRoom(bid, selected_room)
            rooms = db_queries.getRooms(bid, selected_floor)

    return jsonify({
        "buildings": buildingsPermissions,
        "selected_building": selected_building,
        "floors": floors,
        "selected_floor": selected_floor,
        "rooms": rooms
    })

@main_bp.route('/RedirectDashboard')
def RedirectDashboard():
    if 'user_id' in session:
        role = session['role']
        if role == 'admin':
        # Redirect to the admin dashboard if logged in as an admin
            return redirect(url_for('account.admDashboard'))

        if role == 'superadmin':
            # Redirect to the super-admin dashboard if the user is a super-admin
            return redirect(url_for('account.superDashboard'))

        if role == 'student':
        # Redirect to the user dashboard if logged in as an user
            return redirect(url_for('account.userDashboard'))
    else:
        # Redirect to the login page if not logged in
        return redirect(url_for('account.login'))

@main_bp.route('/AccountLogs', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_account_logs():
    user_id = request.args.get('user_id')
    role = request.args.get('role')
    token = request.args.get('token')

    # Verify token
    uidauthtoken = db_queries.getTokenByUID(user_id)
    uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
    if uidauthtoken != token:
        return jsonify({"error": "Unauthorized"}), 401

    if role not in ['admin', 'superadmin']:
        return jsonify({"error": "Access denied"}), 403

    if role == 'admin':
        logs = db_queries.get_account_logsADM()
    if role == 'superadmin':
        logs = db_queries.get_account_logs()

    return jsonify(logs)