from flask import Flask, session
from HelloFlask.views import main_bp
from HelloFlask.AccountLogicViews import account_bp
from HelloFlask.queries import Queries
from flask_cors import CORS
from flask_session import Session
import os

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins="http://localhost:64749") 

    #app.secret_key = 'sMcP4D0JVI0i'
    app.config['SECRET_KEY'] = 'sMcP4D0JVI0i'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Allows cross-origin requests
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS

    Session(app) # initializes session (must come before blueprints)

    app.register_blueprint(main_bp)
    app.register_blueprint(account_bp)

    db_queries = Queries()

    @app.teardown_appcontext
    def close_db(exception=None):
        db_queries.close()

    return app

app = create_app()