# This file was implemented by Guilherme Domingues Cassiano 
# A section by Shane Petree

from flask import render_template, request, redirect, url_for, Blueprint, jsonify, session, current_app
from HelloFlask.queries import Queries
from datetime import datetime 
import os
from werkzeug.utils import secure_filename
# Create an instance of the Queries class for database operations
db_queries = Queries()
main_bp = Blueprint('main', __name__)

@main_bp.route('/', methods=['GET'])
def home():
    return render_template("index.html")

@main_bp.route('/api/buildings', methods=['GET'])
def get_buildings():
    buildings = db_queries.getBuildings()  # Query to fetch building data
    return jsonify(buildings)  # Return the building data as JSON


@main_bp.route('/Items', methods=['GET', 'POST'])
def Reportitems():
    if 'user_id' in session:
        if request.method == 'POST':
            dateFound = request.form['dateFound']
            locationFound = request.form['locationFound']
            itemType = request.form['itemType']
            description = request.form['description']
            location = request.form['location']

            # Use the application's root path to construct the upload folder path
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)

            image_file = request.files.get('imagePhoto')
            relative_path = None 

            if image_file and image_file.filename:
                filename = secure_filename(image_file.filename)
                file_path = os.path.join(upload_folder, filename)
                try:
                    image_file.save(file_path)
                    # Save the relative path for use in templates
                    relative_path = os.path.join('uploads', image_file.filename).replace('\\', '/')
                except Exception as e:
                    print(f"Error saving file: {e}")

            # Insert item into the database
            db_queries.insert_item(itemType, locationFound, description, dateFound, location, relative_path)

            return redirect(url_for('main.Reportitems'))

        return render_template('/items.html')
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))


@main_bp.route('/remove_item', methods=['GET', 'POST'])
def Removeitems():
    if 'user_id' in session:
        # Handle POST request (when an item is being deleted)
        building = session.get('building')
        #building = request.args.get('building')
        sort_order = request.args.get('sort', 'oldest') # Get sorting order (default to oldest)
           # If "all" is selected, fetch all items; otherwise, filter by the selected type
        order = "ASC" if sort_order == "oldest" else "DESC"
        if request.method == 'POST':
            # Retrieve item details from the form
            item_type = request.form['itemType']
            location_found = request.form['locationFound']
            date_found = request.form['dateFound']
            description = request.form['description']
            dateClaimed = datetime.now().strftime('%Y-%m-%d')
            # Call the delete query
            db_queries.insert_Claimed_item(item_type, location_found, description, date_found, dateClaimed, building)
            db_queries.deleteItem(item_type, location_found, date_found, description)
            # Redirect back to the remove_item page to show the updated list
            return redirect(url_for('main.Removeitems', building = building ))

        # Handle GET request (render the items)
        # Get the filter value from the query string (default to 'all')
        filter_type = request.args.get('filterType', 'all')

        # Fetch items based on the filter
        if filter_type == 'all':
            items = db_queries.get_items(building,order )  # Fetch all items
        else:
            items = db_queries.get_items_by_type(filter_type, order)  # Fetch filtered items

        # Render the template with items and filterType
        return render_template('/remove_item.html', items=items, filterType=filter_type, building=building)
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))


@main_bp.route('/claimedItems', methods=['GET', 'POST'])
def ClaimedItems():
    filter_type = request.args.get('filterType', 'all')  # Default to 'all'
    building = request.args.get('building')  # Get the building parameter
    sort_order = request.args.get('sort', 'oldest') # Get sorting order (default to oldest)
    # If "all" is selected, fetch all items; otherwise, filter by the selected type
    order = "ASC" if sort_order == "oldest" else "DESC"

    if filter_type == 'all':
        items = db_queries.get_Claimed_items(building, order)  # Fetch all items
    else:
        items = db_queries.get_Claimed_items_by_type(building, filter_type, order)  # Fetch filtered items
    return render_template("claimedItems.html", items=items, filter_type=filter_type, sort_order=sort_order, building=building)

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
    return render_template('L&F.html', items=items, filter_type=filter_type, sort_order=sort_order, building=building)

@main_bp.route('/RedirectDashboard')
def RedirectDashboard():
    # Check if the user is logged in (assuming `user_id` is stored in the session)
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

        if role == 'user':
        # Redirect to the user dashboard if logged in as an user
            return redirect(url_for('account.userDashboard'))
    else:
        # Redirect to the login page if not logged in
        return redirect(url_for('account.login'))



