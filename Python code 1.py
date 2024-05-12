from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_wtf.csrf import CSRFProtect  # Import CSRF protection

app = Flask(__name__)

# Update the database URI to connect to your new database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:159008@localhost/worktree_1.0'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['WTF_CSRF_SECRET_KEY'] = 'super-secret-csrf-key'  # Set CSRF secret key
app.config['WTF_CSRF_TIME_LIMIT'] = None  # Disable time-limited CSRF tokens
csrf = CSRFProtect(app)  # Initialize CSRF protection
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Define your database model
class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    modulecode = db.Column(db.String, nullable=False)
    modulename = db.Column(db.String, nullable=False)
    level = db.Column(db.String)
    taught = db.Column(db.String)
    credits = db.Column(db.Integer)
    convenor = db.Column(db.String)
    description = db.Column(db.Text)
    prerequisites = db.Column(db.String)
    school = db.Column(db.String)
    target_students = db.Column(db.String)

# Define your API endpoints
@app.route('/login', methods=['POST'])
def login():
    # You may need to change the hardcoded credentials here
    username = request.json.get('username')
    password = request.json.get('password')
    if username == 'admin' and password == 'password':
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({'msg': 'Invalid credentials'}), 401

@app.route('/modules', methods=['GET'])
@jwt_required()
def get_modules():
    # Your code to retrieve modules remains the same

@app.route('/modules', methods=['POST'])
@jwt_required()
def create_module():
    # Your code to create a module remains the same

@app.route('/modules/<int:id>', methods=['PUT'])
@jwt_required()
def update_module(id):
    # Your code to update a module remains the same

@app.route('/modules/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_module(id):
    # Your code to delete a module remains the same

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
