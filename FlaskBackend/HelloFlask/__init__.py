from flask import Flask, session, redirect, url_for, jsonify, request
from HelloFlask.views import main_bp
from HelloFlask.AccountLogicViews import account_bp
from HelloFlask.queries import Queries
from flask_cors import CORS
from datetime import timedelta, datetime
import time

def create_app():
    app = Flask(__name__)
    
    # Allow all origins for now — you can lock this down later
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Session config
    app.secret_key = 'sMcP4D0JVI0i'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=15)

    app.register_blueprint(main_bp)
    app.register_blueprint(account_bp)

    db_queries = Queries()

    @app.teardown_appcontext
    def close_db(exception=None):
        db_queries.close()
    
    return app
