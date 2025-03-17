# Guilherme Cassiano, Shane Petree, Mary Cottier
from pickle import TRUE
from flask import Blueprint, jsonify, render_template, request, redirect, url_for, flash, session
from HelloFlask.queries import Queries  
from werkzeug.security import generate_password_hash, check_password_hash
import os
import tempfile
from flask_cors import cross_origin

# Instance of Queries for database access
db_queries = Queries()
account_bp = Blueprint('account', __name__)

# Mary Cottier
# handles the login http request from angular
@account_bp.route('/login', methods=['POST'])
@cross_origin(origins=["http://localhost:64749"], supports_credentials=True)
def login():
    data = request.get_json()
    username = data.get('NetId')
    password = data.get('password')

    user = db_queries.getUser(username)

    if user and user['active'] == True and check_password_hash(user['password'], password):
        session['user_id'] = user['uid']
        session['role'] = user['role']
        session['username'] = user['username']
        session['authToken'] = user['role']  # Store the role as authToken

        print("Session after login:", dict(session))  # ✅ Print session data

        return jsonify({
            'success': True,
            'user': {
                'uid': user['uid'],
                'role': user['role'],
                'username': user['username'],
            },
            'authToken': user['role'] 
        })
    else:
        return jsonify({'success': False}), 401


@account_bp.route('/logout')
def logout():
    # Check if the user is logged in
    if 'user_id' not in session:
        # Redirect to login if not logged in
        return redirect(url_for('account.login'))
    
    # Clear the session
    session.clear()
    return redirect(url_for('main.home'))

@account_bp.route('/adduser', methods=['POST'])
@cross_origin(supports_credentials=True)
def addUser():
    print("Session before authorization:", dict(session))

    print("Session details:", session)

    # Check if the session has a valid user and that the role is 'admin'
    if session.get('role') != 'admin':
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

    data = request.get_json()
    username = data.get('netID')
    password = data.get('password')
    email = data.get('email')
    role = data.get('role')  # Dynamic role from form
    buildings = data.get('buildings')

    if not all([username, password, email, role, buildings]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if not email.endswith('@unr.edu'):
        return jsonify({'success': False, 'message': 'Invalid email domain. Use @unr.edu'}), 400

    hashed_password = generate_password_hash(password)

    try:
        # Create user with dynamic role
        db_queries.createAccount(username, hashed_password, email, role)
        uid = db_queries.getUserId(username)

        # Create permissions for each building
        for building in buildings:
            bid = db_queries.getBuildingID(building)
            db_queries.createPermissions(bid, uid)

        return jsonify({'success': True, 'message': f'User {username} added successfully'})
    except Exception as e:
        print(f"Error adding user: {str(e)}")  # Log the error
        return jsonify({'success': False, 'message': f'Internal Server Error: {str(e)}'}), 500

@account_bp.route('/adduserSuper', methods=['GET', 'POST'])
def addUserSuper():
    buildingsDisplay = db_queries.getAllBuildings()
    if request.method == 'POST':
        # Check for file upload
        file = request.files.get('batchFile')
        if file and file.filename.endswith('.txt'):
            # Process batch file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                file.save(temp_file.name)
                file_path = temp_file.name

            with open(file_path, 'r') as f:
                for line in f:
                    print(f"Processing line: {line.strip()}")
                    parts = line.strip().split(',')
                    if len(parts) == 4:
                        netID, email, password, building = parts
                        hashed_password = generate_password_hash(password)
                        try:
                            db_queries.createAccount(netID, hashed_password, email, 'student', building)
                            print(f"User {netID} added successfully.")
                        except Exception as e:
                            print(f"Error adding user {netID}: {e}")
                    else:
                        print(f"Invalid line format: {line.strip()}")

            os.remove(file_path)
            return redirect(url_for('account.addUserSuper', buildingsDisplay=buildingsDisplay))

        # Check for single-user form submission
        username = request.form.get('netID')
        password = request.form.get('NetID password')
        email = request.form.get('email')
        buildings = request.form.getlist('building') 
        role = request.form.get('role')
        if not any([file, username, password, email, buildings]):
            error_message = 'Please fill out all fields on the form or upload a valid file.'
            return render_template("AccountLogic/adduserSuper.html", error=error_message, buildingsDisplay=buildingsDisplay)

        if all([username, password, email, buildings]):
            # Validate and process single-user form submission
            if not email.endswith('@unr.edu'):
                error_message = "Invalid email domain. Please use an @unr.edu email."
                return render_template("AccountLogic/adduserSuper.html", error=error_message, buildingsDisplay=buildingsDisplay)
            #hash user passowrd
            hashed_password = generate_password_hash(password)
            #create account 
            db_queries.createAccount(username, hashed_password, email, role)
            #get user ID from netID
            uid = db_queries.getUserId(username)
            #create a permission for each bulding
            for building in buildings:
                bid = db_queries.getBuildingID(building)
                db_queries.createPermissions(bid, uid)
            
            
            print(f"User {username} added successfully.")
            return redirect(url_for('account.addUserSuper', buildingsDisplay=buildingsDisplay))

        # If neither file nor form is valid, show an error
        error_message = 'Please provide a valid file or fill out the form completely.'
        return render_template("AccountLogic/adduserSuper.html", error=error_message, buildingsDisplay=buildingsDisplay)

    return render_template("AccountLogic/adduserSuper.html", buildingsDisplay=buildingsDisplay)


@account_bp.route('/VoidStudent', methods=['GET', 'POST'])
def voidUser():
        if 'user_id' in session:
            username = session.get('username')
            uid = db_queries.getUserId(username)
            buildings = db_queries.getBuildingsFromPermissions(uid)
            if request.method == 'POST':
                selected_building = request.form.get('selected_building') 
            else:
                selected_building = request.args.get('building')  
            # Default to the first building if none is selected
            if selected_building is None or selected_building == '':
                if buildings:
                    selected_building = buildings[0]
            if request.method == 'POST':
                email = request.form['email']
                username = request.form['username']
                db_queries.deleteUser(email, username)
                return redirect(url_for('account.voidUser'))
        filter_type_building = request.args.get('building', 'all')  # Default to 'all'

        if filter_type_building == 'all':
            users = db_queries.getUserVoid('student', 'true')  # Fetch all users
        else:
            bid = db_queries.getBuildingID(filter_type_building)
            uid_list = db_queries.getUsersFromPermissions(bid)  # Get list of UIDs
            users = db_queries.getUserVoidFiltered(uid_list, 'student', 'true')  # Pass list of UIDs
        return render_template("AccountLogic/voiduser.html", users=users, filter_type_building=filter_type_building, buildings=buildings, selected_building=selected_building)

@account_bp.route('/VoidStudentSuper', methods=['GET', 'POST'])
def voidUserSuper():
        if 'user_id' in session:
            buildings = db_queries.getAllBuildings()
            if request.method == 'POST':
                selected_building = request.form.get('selected_building') 
            else:
                selected_building = request.args.get('building')  
            # Default to the first building if none is selected
            if selected_building is None or selected_building == '':
                if buildings:
                    selected_building = buildings[0]
            if request.method == 'POST':
                email = request.form['email']
                username = request.form['username']
                db_queries.deleteUser(email, username)
                return redirect(url_for('account.voidUserSuper'))
        filter_type_building = request.args.get('building', 'all')  # Default to 'all'

        if filter_type_building == 'all':
            users = db_queries.getUserVoidSuper('student', 'admin', 'true')  # Fetch all users
        else:
            bid = db_queries.getBuildingID(filter_type_building)
            uid_list = db_queries.getUsersFromPermissions(bid)  # Get list of UIDs
            users = db_queries.getUserVoidFilteredSuper(uid_list, 'student', 'admin', 'true')  # Pass list of UIDs
        return render_template("AccountLogic/voidusersuperADM.html", users=users, filter_type_building=filter_type_building, buildings=buildings, selected_building=selected_building)


