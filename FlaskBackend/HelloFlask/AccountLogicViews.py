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

valid_roles = {"admin", "student", "superadmin"}

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

    data = request.get_json()
    if not data:  
        return jsonify({'error': 'Invalid JSON payload'}), 400  

    username = data.get('netID')
    password = data.get('password')
    email = data.get('email')
    role = data.get('role')

    if not role:
        return jsonify({"error": "Role is required"}), 400  

    role = role.strip().lower()  # ✅ Normalize role input
    print(f"Received role: '{role}'")  # ✅ Debug output
    print(f"Valid roles: {valid_roles}")  # ✅ Debug output

    if role not in valid_roles:
        return jsonify({"error": f"Invalid role specified: {role}"}), 400  # ✅ Include invalid role in error message

    if not all([username, password, email, role]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if not email.endswith('@unr.edu'):
        return jsonify({'success': False, 'message': 'Invalid email domain. Use @unr.edu'}), 400

    hashed_password = generate_password_hash(password)

    try:
        db_queries.createAccount(username, hashed_password, email, role)
        uid = db_queries.getUserId(username)

        return jsonify({'success': True, 'message': f'User {username} added successfully'})
    except Exception as e:
        print(f"Error adding user: {str(e)}")  
        return jsonify({'success': False, 'message': f'Internal Server Error: {str(e)}'}), 500

@account_bp.route('/getUserRole', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user_role():
    if 'role' in session:
        return jsonify({'role': session['role']})
    return jsonify({'role': None}), 401

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


