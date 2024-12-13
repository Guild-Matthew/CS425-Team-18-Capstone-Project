# This file was implemented by Guilherme Domingues Cassiano 
from flask import render_template, request, redirect, url_for, Blueprint, jsonify, session, current_app
from HelloFlask.queries import Queries
from datetime import datetime 
import os
from werkzeug.utils import secure_filename

db_queries = Queries()
main_bp = Blueprint('main', __name__)

# Route for the initial map page
@main_bp.route('/', methods=['GET'])
def home():
    return render_template("index.html")

@main_bp.route('/api/buildings', methods=['GET'])
def get_buildings():
    buildings = db_queries.getBuildings()  
    return jsonify(buildings)  

# Route for the "Report items" Page
@main_bp.route('/Items', methods=['GET', 'POST'])
def Reportitems():
    # If user is logged in
    if 'user_id' in session:
        if request.method == 'POST':
            # Get information fomr the report item form
            dateFound = request.form['dateFound']
            locationFound = request.form['locationFound']
            itemType = request.form['itemType']
            description = request.form['description']
            location = request.form['location']
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            image_file = request.files.get('imagePhoto')
            relative_path = None 

            if image_file and image_file.filename:
                filename = secure_filename(image_file.filename)
                file_path = os.path.join(upload_folder, filename)
                try:
                    image_file.save(file_path)
                    relative_path = os.path.join('uploads', image_file.filename).replace('\\', '/')
                except Exception as e:
                    print(f"Error saving file: {e}")
            # Call the query
            db_queries.insert_item(itemType, locationFound, description, dateFound, location, relative_path)
            # Redirect back to the page to report more items 
            return redirect(url_for('main.Reportitems'))
        return render_template('/items.html')
    # If user is not logged in
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))

# Route for the remove an item page (page where lost and found woreker can remove item from lost and found list)
@main_bp.route('/remove_item', methods=['GET', 'POST'])
def Removeitems():
    # If user is logged in
    if 'user_id' in session:
        # Get building worker works on 
        building = session.get('building')
        if request.method == 'POST':
           # Get information from the report item form
            item_type = request.form['itemType']
            location_found = request.form['locationFound']
            date_found = request.form['dateFound']
            description = request.form['description']
            dateClaimed = datetime.now().strftime('%Y-%m-%d')
            # Call the query
            db_queries.insert_Claimed_item(item_type, location_found, description, date_found, dateClaimed, building)
            db_queries.deleteItem(item_type, location_found, date_found, description)
            # Redirect back to the page to show the updated list
            return redirect(url_for('main.Removeitems', building = building ))
        # Get the filter value from the query string 
        filter_type = request.args.get('filterType', 'all')
        # Fetch items based on the filter
        if filter_type == 'all':
            items = db_queries.get_items(building)  # Fetch all items
        else:
            items = db_queries.get_items_by_type(filter_type)  # Fetch filtered items
        # Render the template with items and filterType
        return render_template('/remove_item.html', items=items, filterType=filter_type, building=building)
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))

# Route for the claimed items page
@main_bp.route('/claimedItems', methods=['GET', 'POST'])
def ClaimedItems():
    filter_type = request.args.get('filterType', 'all')  # Default to 'all'
    building = request.args.get('building')  # Get the building 
    sort_order = request.args.get('sort', 'oldest') # Get sorting order 
    order = "ASC" if sort_order == "oldest" else "DESC"
    if filter_type == 'all':
        items = db_queries.get_Claimed_items(building, order)  # Fetch all items
    else:
        items = db_queries.get_Claimed_items_by_type(building, filter_type, order)  # Fetch filtered items
    return render_template("claimedItems.html", items=items, filter_type=filter_type, sort_order=sort_order, building=building)

# Route for the "Lost and Found" page
@main_bp.route('/L&F', methods=['GET'])
def info():
    filter_type = request.args.get('filterType', 'all')  # Default to 'all'
    building = request.args.get('building')  # Get the building 
    sort_order = request.args.get('sort', 'oldest') # Get sorting order 
    order = "ASC" if sort_order == "oldest" else "DESC"
    if not building:
        return "Building parameter is required", 400
    # If "all" is selected show all items, if not get only items of itemType
    if filter_type == 'all':
        items = db_queries.get_items(building, order)
    else:
        items = db_queries.get_items_by_type(filter_type, building, order)

    # Render the template with building and filtered items
    return render_template('L&F.html', items=items, filter_type=filter_type, sort_order=sort_order, building=building)

# Route to redirect the user to either the admin or user dashboard depenbding on their role
@main_bp.route('/RedirectDashboard')
def RedirectDashboard():
    # Check if the user is logged in 
    if 'user_id' in session:
        role = session['role']
        if role == 'admin':
        # Redirect to the admin dashboard if logged in as an admin
            return redirect(url_for('account.admDashboard'))
        else:
        # Redirect to the user dashboard if logged in as an user
            return redirect(url_for('account.userDashboard'))
    else:
        # Redirect to the login page if not logged in
        return redirect(url_for('account.login'))



