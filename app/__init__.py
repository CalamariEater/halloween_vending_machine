from flask import Flask
from config import Config

app = Flask(__name__)
#app.config.from_object(Config)
app.secret_key = 'vend_me_daddy'
#app.config['SESSION_TYPE'] = ''

from app import routes