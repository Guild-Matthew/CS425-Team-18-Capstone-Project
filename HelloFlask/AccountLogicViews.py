from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from HelloFlask.queries import Queries  # Assuming Queries class handles database operations for accounts
from werkzeug.security import generate_password_hash, check_password_hash

# Instance of Queries for database access
db_queries = Queries()
account_bp = Blueprint('account', __name__)

@account_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['NetId']
        password = request.form['password']
        email = request.form['email']
        # Retrieve user information from the database
        user = db_queries.getUser(username, email)  # Assume `get_user` retrieves user data

        # Validate user and password
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['role'] = user['role'] 
            next_url = session.pop('next_url', None)
            return redirect(next_url or url_for('main.home'))
        else:
            flash("Invalid username or password.")

    # Render the login page if GET request or failed login
    return render_template('AccountLogic/login.html')

@account_bp.route('/admdashboard', methods=['GET'])
def admDashboard():
    return render_template("AccountLogic/admin_home.html")

@account_bp.route('/userdashboard', methods=['GET'])
def userDashboard():
    return render_template("AccountLogic/user_home.html")

@account_bp.route('/logout')
def logout():
    # Check if the user is logged in
    if 'user_id' not in session:
        # Redirect to login if not logged in
        return redirect(url_for('account.login'))
    
    # Clear the session
    session.clear()
    return redirect(url_for('main.home'))

@account_bp.route('/adduser', methods=['GET', 'POST'])
def addUser():
    if request.method == 'POST':
        username = request.form['netID']
        password = request.form['NetID password']
        email = request.form['email']
        building = request.form['building']
        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create account in the database
        db_queries.createAccount(username, hashed_password, email, 'student')
        
        return redirect(url_for('account.addUser'))
    return render_template("AccountLogic/adduser.html")