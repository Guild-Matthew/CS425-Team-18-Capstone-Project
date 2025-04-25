# Guilherme Cassiano, Mary Cottier, Shane Petree

from os import getenv
from flask import Flask, session, redirect, url_for, jsonify, request
from HelloFlask.views import main_bp
from HelloFlask.AccountLogicViews import account_bp
from HelloFlask.queries import Queries
from flask_cors import CORS
from datetime import timedelta, datetime
import time
from dotenv import load_dotenv

# load env variables
load_dotenv('.env')

def create_app():
    app = Flask(__name__)    
    # Allow all origins for now, you can lock this down later
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # set debug mode
    # app.config['DEBUG'] = getenv("DEBUG")

    app.secret_key = getenv("FLASK_APP_KEY")
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=15)
    app.register_blueprint(main_bp)
    app.register_blueprint(account_bp)

    db_queries = Queries()

    @app.teardown_appcontext
    def close_db(exception=None):
        db_queries.close()

    return app

app = create_app()