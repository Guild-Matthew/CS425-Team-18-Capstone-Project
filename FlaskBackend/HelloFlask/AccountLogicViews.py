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
from collections import defaultdict
from datetime import datetime
import random

from flask_mail import Message
from HelloFlask.init_mail import mail

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
        session['last_activity'] = datetime.utcnow().isoformat()  
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

# checks if the user account exists, not needed? DELETE IF NOT USED
@account_bp.route('/checkuser', methods=['POST'])
@cross_origin(supports_credentials=True)
def checkUser():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')

        # TEST PRINT
        # print(username)
        # print(email)

        # get user from NetID
        user = db_queries.getUserAll(username)

        # TEST PRINT
        # print(f'usernames match: ', {(user['username'] == username)})
        # print(f'emails match: ', {(user['email'] == email)})

        # if the user exists, then the reset password email can be sent
        if user and user['active'] == True and user['username'] == username and user['email'] == email:
            
            # create the n (6) digit temp code
            n = 6
            range_start = 10**(n-1)
            range_end = (10**n)-1
            auth_code = str(random.randint(range_start, range_end))

            # TEST PRINT
            # print(f'auth_code: {auth_code}')

            # update user's auth token with temp auth code
            # db_queries.updateUserToken(user['uid'], )
            db_queries.updateUserToken(user['uid'], auth_code)

            # check if the user's authtoken was updated
            user = db_queries.getUserAll(username)

            # TEST PRINT
            # print(f'authtokens match: ', {(user['authtoken'] == auth_code)})

            if user and user['authtoken'] == auth_code:

                # send password reset email
                msg = Message(
                    subject = "Your one-time password reset code",
                    sender = os.getenv("EMAIL"),
                    # recipients = [os.getenv("TEMP_EMAIL")],
                    recipients = [email],

                )
                msg.body = f'Your one-time password reset code \n\n {auth_code}'
                mail.send(msg)
            
                return jsonify({
                    'success': True,
                }), 200
            else:
                # change this message after it works
                jsonify({"error": "Authoken was not updated"}), 401

        else:
            return jsonify({"error": "Unauthorized"}), 401
        # formAuthToken = request.form.get('authToken')
        
    else:
        return jsonify({"error": "Unauthorized"}), 401

@account_bp.route('/forgotpassword', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def forgotPassword():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        new_password = request.form.get('new_password')
        auth_code = request.form.get('auth_code')
        action = request.form.get('action')

        # get user from NetID
        user = db_queries.getUserAll(username)
        
        # change the password if the passwords match and the auth_code matches db/email
        if action == 'change_password':

            # if the user exists, and sent the correct auth code, then the user's password can be reset
            if user and user['active'] == True and user['username'] == username and user['email'] == email and user['authtoken'] == auth_code:
            
                hashed_password = generate_password_hash(new_password)
                db_queries.updateUserPassword(user['uid'], hashed_password)

                # check if the password was updated in DB
                user = db_queries.getUserAll(username)

                if user and user['password'] == hashed_password:
                    return jsonify({
                        'success': True,
                    }), 200
                else:
                    # change this message after it works
                    return jsonify({"error": "Password was not updated"}), 401

            else:
                return jsonify({"error": "Unauthorized"}), 401
    
        # check if the auth_code is valid
        if action == 'check_auth_code':
            if user and user['active'] == True and user['username'] == username and user['email'] == email and user['authtoken'] == auth_code:

                if user and user['authtoken'] == auth_code:
                    return jsonify({
                        'success': True,
                    }), 200
                else:
                    # change this message after it works
                    return jsonify({"error": "Incorrect security code"}), 401
    
    else:
        return jsonify({"error": "Unauthorized"}), 401


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
            #! UNCOMMENT AFTER EMAIL WORKS----------------------------------------------------------------------------
            # if not email.endswith('@unr.edu'):
            #     return jsonify({"error": "Email is not valid"}), 400

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

@account_bp.route('/deactivate_user', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def deactivate_user():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        role = data.get('role')
        token = data.get('authtoken')

        uidauthtoken = db_queries.getTokenByUID(user_id)
        uidauthtoken = uidauthtoken[0] if isinstance(uidauthtoken, list) and uidauthtoken else None
        if uidauthtoken != token:
            return jsonify({"error": "Unauthorized"}), 401

        target_id = data.get('target_id')
        print("ID", target_id)
        if not target_id:
            return jsonify({"error": "Missing target user ID"}), 400
        email_data = db_queries.getEmailFromUID(target_id)
        invalidated_user_role = db_queries.getRoleFromUID(target_id)
        email = email_data['email'] if isinstance(email_data, dict) and 'email' in email_data else 'unknown'
        user_role = invalidated_user_role['role'] if isinstance(invalidated_user_role, dict) and 'role' in invalidated_user_role else 'unknown'
        db_queries.deactivateUser(target_id, email, user_role)
        return jsonify({"message": "Account deactivated"}), 200

    user_id = request.args.get('user_id')
    role = request.args.get('role')
    buildings_param = request.args.getlist('building')

    if not user_id:
        return jsonify({"error": "Unauthorized - Missing User ID"}), 401

    # Determine accessible buildings based on role
    if role == 'superadmin':
        all_buildings = db_queries.getAllBuildings()
    elif role == 'admin':
        all_buildings = db_queries.getBuildingsFromPermissions(user_id)
    else:
        return jsonify({"error": "Unauthorized role"}), 403

    # Fix: handle 'all' or empty selection
    selected_buildings = buildings_param if buildings_param and buildings_param != ['all'] else all_buildings

    # Collect UID list from selected buildings
    uid_lists = []
    for b in selected_buildings:
        bid = db_queries.getBuildingID(b)
        uids = db_queries.getUsersFromPermissions(bid)
        uid_lists.extend(uids)

    uid_lists = list(set(uid_lists))  # Remove duplicates
    users = db_queries.getUserVoidFiltered(uid_lists, 'student', 'true')
    formatted_users = []
    user_map = {}

    for b in selected_buildings:
        bid = db_queries.getBuildingID(b)
        uids = db_queries.getUsersFromPermissions(bid)
        users = db_queries.getUserVoidFiltered(uids, 'student', 'true')
    
        if users != "none":
            for u in users:
                uid = u.get('id', 0)
                if uid not in user_map:
                    user_map[uid] = {
                    "name": u['username'],
                    "email": u['email'],
                    "role": u['role'],
                    "id": uid,
                    "buildings": [b]
                    }
                else:
                    user_map[uid]["buildings"].append(b)
    formatted_users = list(user_map.values())
    print("Formatted users", formatted_users)
    return jsonify({
        "users": formatted_users,
        "buildings": all_buildings,
        "selected_building": selected_buildings
    })



# @account_bp.before_request
# def session_timeout_check():
#     session.permanent = True
#     now = datetime.utcnow()
 
#     if 'user_id' in session:
#         last_activity_str = session.get('last_activity')
#         if last_activity_str:
#             try:
#                 last_activity = datetime.fromisoformat(last_activity_str)
#                 inactive_duration = (now - last_activity).total_seconds()
#                 timeout = session._get_current_object().config['PERMANENT_SESSION_LIFETIME'].total_seconds()  # Corrected
#                 if inactive_duration > timeout:
#                     session.clear()
#                     if 'application/json' in str(request.accept_mimetypes):
#                         return jsonify({'error': 'Session timed out'}), 401
#                     else:
#                         return redirect(url_for('account.login'))
#             except ValueError:
#                 # malformed date, clear session for safety
#                 session.clear()
#                 return redirect(url_for('account.login'))
 
#         # Always update activity timestamp
#         session['last_activity'] = now.isoformat()