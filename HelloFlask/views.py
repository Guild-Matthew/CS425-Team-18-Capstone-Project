from flask import render_template, request, redirect, url_for, Blueprint, jsonify, session
from HelloFlask.queries import Queries
from datetime import datetime 

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

@main_bp.route('/L&F', methods=['GET', 'POST'])
def info():
    # Get the filter value from the query string (default to 'all')
    filter_type = request.args.get('filterType', 'all')
    building = request.args.get('building')
    # If "all" is selected, fetch all items; otherwise, filter by the selected type
    if filter_type == 'all':
        items = db_queries.get_items(building)  # Fetch all items
    else:
        items = db_queries.get_items_by_type(filter_type)  # Fetch filtered items

    # Render the template with the filtered items and current filter
    return render_template('L&F.html', items=items, filterType=filter_type,  building=building)



@main_bp.route('/Items', methods=['GET', 'POST'])
def Reportitems():
    if 'user_id' in session:
        if request.method == 'POST':
            dateFound = request.form['dateFound']
            locationFound = request.form['locationFound']
            itemType = request.form['itemType']
            description = request.form['description']
            location = request.form['location']
            db_queries.insert_item(itemType, locationFound, description, dateFound, location)

            # Redirect to avoid duplicate form submissions
            return redirect(url_for('main.Reportitems'))

        return render_template('/items.html')
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))


@main_bp.route('/remove_item', methods=['GET', 'POST'])
def Removeitems():
    if 'user_id' in session:
        # Handle POST request (when an item is being deleted)
        building = request.args.get('building')
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
            items = db_queries.get_items(building)  # Fetch all items
        else:
            items = db_queries.get_items_by_type(filter_type)  # Fetch filtered items

        # Render the template with items and filterType
        return render_template('/remove_item.html', items=items, filterType=filter_type, building=building)
    else:
        session['next_url'] = request.url
        return redirect(url_for('account.login'))


@main_bp.route('/claimedItems', methods=['GET', 'POST'])
def ClaimedItems():
    building = request.args.get('building')
    # Get the filter value from the query string (default to 'all')
    filter_type = request.args.get('filterType', 'all')
     
    # If "all" is selected, fetch all items; otherwise, filter by the selected type
    if filter_type == 'all':
        items = db_queries.get_Claimed_items(building)  # Fetch all items
    else:
        items = db_queries.get_Claimed_items_by_type(filter_type)  # Fetch filtered items
    return render_template("claimedItems.html", items=items, filterType=filter_type, building=building)


@main_bp.route('/RedirectDashboard')
def RedirectDashboard():
    # Check if the user is logged in (assuming `user_id` is stored in the session)
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


