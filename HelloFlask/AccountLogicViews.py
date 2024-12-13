# This file was implemented by Guiilherme Domingues Cassiano
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from HelloFlask.queries import Queries  
from werkzeug.security import generate_password_hash, check_password_hash
import os
import tempfile

# Instance of Queries for database access
db_queries = Queries()
account_bp = Blueprint('account', __name__)

# Route for the log in page
@account_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['NetId']
        password = request.form['password']
        email = request.form['email']
        # Retrieve user information from the database
        user = db_queries.getUser(username, email)  

        # Validate user and password
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['role'] = user['role'] 
            session['building'] = user.get('building')
            next_url = session.pop('next_url', None)
            return redirect(next_url or url_for('main.home'))
        else:
            flash("Invalid username or password.")

    # Render the login page if GET request or failed login
    return render_template('AccountLogic/login.html')

# Route for the admin page
@account_bp.route('/admdashboard', methods=['GET'])
def admDashboard():
     # Render the admin dashboard
    return render_template("AccountLogic/admin_home.html")
    
# Route for the user page
@account_bp.route('/userdashboard', methods=['GET'])
def userDashboard():
     # Render the user dashboard
    return render_template("AccountLogic/user_home.html")
    
# Route for logging the user out 
@account_bp.route('/logout')
def logout():
    # Check if the user is logged in
    if 'user_id' not in session:
        # Redirect to login if not logged in
        return redirect(url_for('account.login'))
    
    # Clear the session
    session.clear()
    return redirect(url_for('main.home'))

# Route for the add user page
@account_bp.route('/adduser', methods=['GET', 'POST'])
def addUser():
    if request.method == 'POST':
        # Check for file upload
        file = request.files.get('batchFile')
        if file and file.filename.endswith('.txt'):
            # Process file
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
            return redirect(url_for('account.addUser'))

        # Check for submission using the form instead of using a file
        username = request.form.get('netID')
        password = request.form.get('NetID password')
        email = request.form.get('email')
        building = request.form.get('building')

        if not any([file, username, password, email, building]):
            error_message = 'Please fill out all fields on the form or upload a valid file.'
            return render_template("AccountLogic/adduser.html", error=error_message)

        if all([username, password, email, building]):
            # Checks if email is a vaild @unr.edu email, if not it doesnt go to the database
            if not email.endswith('@unr.edu'):
                error_message = "Invalid email domain. Please use an @unr.edu email."
                return render_template("AccountLogic/adduser.html", error=error_message)

            hashed_password = generate_password_hash(password)
            try:
                db_queries.createAccount(username, hashed_password, email, 'student', building)
                print(f"User {username} added successfully.")
            except Exception as e:
                print(f"Error adding user {username}: {e}")
                return "Error adding user", 500

            return redirect(url_for('account.addUser'))
            
        error_message = 'Please provide a valid file or fill out the form completely.'
        return render_template("AccountLogic/adduser.html", error=error_message)

    return render_template("AccountLogic/adduser.html")


# Route for the delete user account page
@account_bp.route('/VoidStudent', methods=['GET', 'POST'])
def voidUser():
    if request.method == 'POST':
           # Retrieve user details for display 
           email = request.form['email']
           username = request.form['username']
           db_queries.deleteUser(email, username)
           return redirect(url_for('account.voidUser'))
    filter_type_building = request.args.get('filterType', 'all')  # Default to 'all'

    if filter_type_building == 'all':
        users = db_queries.getUserVoid('student')  # Fetch all users
    else:
        users = db_queries.getUserVoidFiltered(filter_type_building, 'student')  # Filter users by type and building
    

    return render_template("AccountLogic/voiduser.html", users=users, filter_type_building=filter_type_building)


