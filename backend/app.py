# backend/app.py
from flask import Flask
from flask_cors import CORS
from models import db
from routes import init_routes

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", methods=["GET", "POST", "PUT", "DELETE"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://yashmakwana@localhost:5432/job_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
init_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
