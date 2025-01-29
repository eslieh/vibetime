from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vibetime.db'
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwtsecretkey'

db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app)
migrate = Migrate(app, db)  # Initialize migration

CORS(app)  # Allow cross-origin requests

from app import routes
