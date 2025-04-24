# Shane Petree

from os import getenv
from flask import Flask
from flask_mail import Mail
from dotenv import load_dotenv

# load env variables
load_dotenv('.env')

mail = Mail()

def create_mail_app():
    mail_app = Flask(__name__)

    # flask-mail email config
    mail_app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    mail_app.config['MAIL_PORT'] = 587         # getenv("MAIL_PORT")
    mail_app.config['MAIL_USE_TLS'] = True
    mail_app.config['MAIL_USE_SSL'] = False
    mail_app.config['MAIL_USERNAME'] = getenv("EMAIL")
    mail_app.config['MAIL_PASSWORD'] = getenv("GMAIL_APP_PASSWORD")
    mail_app.config['MAIL_DEFAULT_SENDER'] = getenv("EMAIL")

    mail.init_app(mail_app)

    return mail_app

mail = Mail(create_mail_app())