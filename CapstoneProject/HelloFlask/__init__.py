from flask import Flask
from HelloFlask.views import main_bp
from HelloFlask.AccountLogicViews import account_bp
from HelloFlask.queries import Queries
def create_app():
    app = Flask(__name__)

    app.secret_key = 'sMcP4D0JVI0i'
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(account_bp)

    db_queries = Queries()

    @app.teardown_appcontext
    def close_db(exception=None):
        db_queries.close()

    return app

app = create_app()