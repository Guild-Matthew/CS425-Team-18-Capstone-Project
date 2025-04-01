# Guilherme Cassiano, Shane Petree, Mary Cottier
from pickle import TRUE
from flask import Blueprint, jsonify, render_template, request, redirect, url_for, flash, session, make_response
from HelloFlask.queries import Queries  
from werkzeug.security import generate_password_hash, check_password_hash
import os
import tempfile
from flask_cors import cross_origin
import json
import uuid
# Instance of Queries for database access
db_queries = Queries()
account_bp = Blueprint('account', __name__)

# handles the login http request from angular
@account_bp.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True) 
def login():
    data = request.get_json() # Get the JSON data from the request
    username = data.get('NetId')
    password = data.get('password')

    # Retrieve user data from the database
    user = db_queries.getUser(username)
    
    if user and user['active'] == True and check_password_hash(user['password'], password):
        session['user_id'] = user['uid']
        session['role'] = user['role']
        session['username'] = user['username']
        session.permanent = True 
        authtoken = str(uuid.uuid4())  
        db_queries.updateUserToken(user['uid'], authtoken)
        return jsonify({
            'success': True,
            'user_id': user['uid'],
            'role': user['role'],
            'username': user['username'],
            'authtoken': authtoken
        }), 200
    else:
        return jsonify({'success': False, 'error': "Invalid credentials"}), 401

@account_bp.route('/logout')
def logout():
    # Check if the user is logged in
    if 'user_id' not in session:
        # Redirect to login if not logged in
        return redirect(url_for('account.login'))
    
    # Clear the session
    db_queries.updateUserToken(session['user_id'])
    session.clear()
    return redirect(url_for('main.home'))

@account_bp.route('/adduser', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True) 
def addUser():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        role = request.form.get('role')
        formAuthToken = request.form.get('authToken')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        if isinstance(uidauthtoken, list):
            uidauthtoken = uidauthtoken[0]  

        if uidauthtoken != formAuthToken:
            return jsonify({"error": "Unauthorized"}), 401


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
            #return redirect(url_for('account.addUser',buildingsDisplay=buildingsDisplay ))

        # Check for single-user form submission
        username = request.form.get('netID')
        password = request.form.get('password')
        email = request.form.get('email')
        selectedRole = request.form.get('selectedRole')
        buildingsJSON = request.form.get('buildings')  #get full JSON from angular
        try:
            buildings = json.loads(buildingsJSON) #converts JSON to python list
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid buildings format"}), 400

        if not any([file, username, password, email, buildings]):
            return jsonify({"error": "Missing fields"}), 400

        if all([username, password, email, buildings]):
            # Validate and process single-user form submission
            if not email.endswith('@unr.edu'):
                return jsonify({"error": "Email is not valid"}), 400
            #hash user passowrd
            hashed_password = generate_password_hash(password)
            #create account 
            db_queries.createAccount(username, hashed_password, email, selectedRole)
            #get user ID from netID
            #create a permission for each bulding
            uid = db_queries.getUserId(username)
            print(buildings)
            for building in buildings:
                bid = db_queries.getBuildingID(building)
                db_queries.createPermissions(bid, uid)
            
            return jsonify({"message": "User added successfully"}), 200

        # If neither file nor form is valid, show an error
        error_message = 'Please provide a valid file or fill out the form completely.'
        return jsonify({"error": "Missing Fields"}), 401

    user_id = request.args.get('user_id')  
    if not user_id:
        return jsonify({"error": "Unauthorized - Missing User ID GET"}), 401
    role = request.args.get('role')
    #role = request.args.get('role')
    if role == 'superadmin':
        buildingsPermissions = db_queries.getAllBuildings()
    elif role == 'admin':
        buildingsPermissions = db_queries.getBuildingsFromPermissions(user_id)
    return jsonify({"buildings": buildingsPermissions})

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
