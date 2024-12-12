import psycopg2
from psycopg2 import sql
from flask import g  # 'g' is Flask's global context for request-scoped variables
from HelloFlask import app

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            dbname="TestDB",
            user="postgres",
            password="#aH6TR5fkcdx99",
            host="localhost",
            port="5432"
        )
    return g.db

@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
