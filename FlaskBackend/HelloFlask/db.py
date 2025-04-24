# Guilherme Domingues Cassiano, Shane Petree

import psycopg2
from psycopg2 import sql
from flask import g  # 'g' is Flask's global context for request-scoped variables
from HelloFlask import app
from os import getenv
from dotenv import load_dotenv

# load env variables
load_dotenv('.env')

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            dbname="testdb",
            user="postgres",
            password=getenv("DATABASE_PASSWORD"),
            host="localhost",
            port="5432"
        )
    return g.db

@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
