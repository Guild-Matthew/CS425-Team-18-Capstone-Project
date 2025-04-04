# This file was implemented by Guilherme Domingues Cassiano
# A section by Shane Petree
from flask import render_template, request, redirect, url_for, Blueprint, jsonify, session, current_app, Flask
from HelloFlask.queries import Queries
from datetime import datetime 
import os
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
# Create an instance of the Queries class for database operations
db_queries = Queries()
main_bp = Blueprint('main', __name__)


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
    filter_type = request.args.get('filterType', 'all')  # Default to 'all'
    building = request.args.get('building')  # Get the building parameter
    sort_order = request.args.get('sort', 'oldest') # Get sorting order (default to oldest)
    # If "all" is selected, fetch all items; otherwise, filter by the selected type
    order = "ASC" if sort_order == "oldest" else "DESC"
    # Ensure building is provided
    if not building:
        return "Building parameter is required", 400

    # Query items based on building and filter
    if filter_type == 'all':
        items = db_queries.get_items(building, order)
    else:
        items = db_queries.get_items_by_type(filter_type, building, order)

    # Render the template with building and filtered items
    return jsonify(items)
    
    # return the query as json data
    # return jsonify(items)

@main_bp.route('/Items', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def Reportitems():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        role = request.form.get('role')
        formAuthToken = request.form.get('authtoken')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        item_type = request.form.get('itemType')
        location_found = request.form.get('locationFound')
        date_found = request.form.get('dateFound') #Should we have this? We can just use datetime.now to get the date when the form was submited 
        description = request.form.get('description')
        lostAndFindLocation = request.form.get('location')  

        if not all([item_type, location_found, date_found, description, lostAndFindLocation]):
            return jsonify({"error": "Missing fields"}), 400

        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        image_file = request.files.get('imagePhoto')
        relative_path = None  

        if image_file and image_file.filename:
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(upload_folder, filename)
            try:
                image_file.save(file_path)
                relative_path = os.path.join('uploads', filename).replace('\\', '/')
            except Exception as e:
                print(f"Error saving file: {e}")

        db_queries.insert_item(item_type, location_found, description, date_found, lostAndFindLocation, relative_path)

        return jsonify({"message": "Item added successfully"}), 200

    user_id = request.args.get('user_id')  
    if not user_id:
        return jsonify({"error": "Unauthorized - Missing User ID"}), 401

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
        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        item_type = data.get('itemType')
        location_found = data.get('locationFound')
        date_found = data.get('dateFound')
        description = data.get('description')
        dateClaimed = datetime.now().strftime('%Y-%m-%d %H:%M')
        lostAndFindLocation = data.get('lfLocation')

        if not all([item_type, location_found, date_found, description]):
            return jsonify({"error": "Missing fields"}), 400

        db_queries.insert_Claimed_item(item_type, location_found, description, date_found, dateClaimed, lostAndFindLocation)
        db_queries.deleteItem(item_type, location_found, date_found, description)

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

    if filter_type == 'all':
        items = db_queries.get_items(selected_building, order)
    else:
        items = db_queries.get_items_by_type(filter_type, selected_building, order)

    response = {
        "items": [{"type": item[0], "location": item[1], "description": item[2], "dateFound": item[3], "lfLocation": selected_building} for item in items],
        "sort_order": sort_order,
        "filterType": filter_type,
        "buildings": buildings,
        "selected_building": selected_building
    }
    return jsonify(response)

@main_bp.route('/claimedItems', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def ClaimedItems():
        user_id = request.args.get('user_id')  
        role = request.args.get('role')
        formAuthToken = request.args.get('token')
        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None

        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        buildings = db_queries.getBuildingsFromPermissions(user_id)
        selected_building = request.args.get('building', buildings[0] if buildings else None)
        sort_order = request.args.get('sort', 'oldest')
        order = "ASC" if sort_order == "oldest" else "DESC"
        filter_type = request.args.get('filterType', 'all')

        if filter_type == 'all':
            items = db_queries.get_Claimed_items(selected_building, order)
        else:
            items = db_queries.get_Claimed_items_by_type(filter_type, selected_building, order)

        response = {
        "items": [{"type": item[0], "location": item[1], "description": item[2], "dateFound": item[3], "lfLocation": selected_building, "dateClaimed": item[4]} for item in items],
        "sort_order": sort_order,
        "filterType": filter_type,
        "buildings": buildings,
        "selected_building": selected_building
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
        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401

        if not all([BuildingCode, Latitude, Longitude]):
            return jsonify({"error": "Missing fields"}), 400

        # Save to Database
        db_queries.createBuilding(BuildingCode, Latitude, Longitude)

        return jsonify({"message": "Building added successfully!"}), 200

@main_bp.route('/editBuilding', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True) 
def EditBuilding():
        user_id = request.args.get('user_id')  
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
            selected_building = request.args.get('building', buildings[0] if buildings else None)

        # Fetch floors for the selected building
        bid = db_queries.getBuildingID(selected_building)
        floors = db_queries.getFloors(bid)  

        if request.method == 'POST':
            action = request.form.get('action') 
            if action == 'add_floor':
                floorNumber = request.form['floorNumber']
                db_queries.addFloor(bid, floorNumber)
                floors = db_queries.getFloors(bid)
            elif action == 'remove_floor':
                floor_number = request.form.get('floor_number') 
                db_queries.removeFloor(bid, floor_number)
                floors = db_queries.getFloors(bid)

        user_id = request.args.get('user_id')  
        if not user_id:
            return jsonify({"error": "Unauthorized - Missing User ID GET"}), 401
        role = request.args.get('role')
        if role == 'superadmin':
            buildingsPermissions = db_queries.getAllBuildings()
        elif role == 'admin':
            buildingsPermissions = db_queries.getBuildingsFromPermissions(user_id)
        return jsonify({
            "buildings": buildingsPermissions,
            "selected_building": selected_building,
            "floors": floors
        })

@main_bp.route('/editFloor', methods=['GET', 'POST'])
def EditFloor():
    if 'user_id' in session:
        buildings = db_queries.getAllBuildings()
        if request.method == 'POST':
            selected_building = request.form.get('selected_building') #had to do this because when query was submited it would send stuff to the first building on the list (AB)
        else:
            selected_building = request.args.get('building')  

        if request.method == 'POST':
            selected_floor = request.form.get('selected_floor') #had to do this because when query was submited it would send stuff to the first building on the list (AB)
        else:
            selected_floor = request.args.get('floor')  

        # Default to the first building if none is selected
        if selected_building is None or selected_building == '':
            if buildings:
                selected_building = buildings[0]
        # Fetch floors for the selected building
        bid = db_queries.getBuildingID(selected_building)
        rooms = db_queries.getRooms(bid, selected_floor)  
        floors = db_queries.getFloors(bid) 

        if selected_floor:
           selected_floor = int(selected_floor)
        if selected_floor is None or selected_floor == '' or selected_floor not in floors:
            if floors:
                selected_floor = floors[0]
        if request.method == 'POST':
            action = request.form.get('action') 
            if action == 'add_room':
                roomNumber = request.form['roomNumber']
                db_queries.addRoom(bid, roomNumber, selected_floor)
                rooms = db_queries.getRooms(bid, selected_floor)
            elif action == 'remove_room':
                room_number = request.form.get('room_number') 
                db_queries.removeRoom(bid, room_number)
                rooms = db_queries.getRooms(bid, selected_floor)

        return render_template("editFloor.html", buildings=buildings, selected_building=selected_building, rooms=rooms, floors=floors, selected_floor=selected_floor)
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))

@main_bp.route('/RedirectDashboard')
def RedirectDashboard():
    if 'user_id' in session:
        role = session['role']
        if role == 'admin':
        # Redirect to the admin dashboard if logged in as an admin
            return redirect(url_for('account.admDashboard'))

    # START Shane Petree
        if role == 'superadmin':
            # Redirect to the super-admin dashboard if the user is a super-admin
            return redirect(url_for('account.superDashboard'))
    # END Shane Petree

        if role == 'student':
        # Redirect to the user dashboard if logged in as an user
            return redirect(url_for('account.userDashboard'))
    else:
        # Redirect to the login page if not logged in
        return redirect(url_for('account.login'))