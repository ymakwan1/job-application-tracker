from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes import init_routes
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", methods=["GET", "POST", "PUT", "DELETE"])

app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
init_routes(app)

# @app.before_request
# def init_db():
#     with app.app_context():
#         db.create_all()
#         db.session.commit()
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)