from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    notes = db.relationship('Note', backref='author', lazy=True)

# Note Model
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Create tables if they don't exist already
with app.app_context():
    db.create_all()

# Authentication Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except IntegrityError as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({'error': 'Username already exists'}), 409
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred during registration'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'username': user.username}), 200

    return jsonify({'error': 'Invalid credentials'}), 401

 
@app.route('/notes', methods=['POST'])
def add_note():
    # Check if user is logged in
    if 'user_id' not in session:
        print("Unauthorized: No user_id in session")
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Proceed with adding the note
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'Note content is required'}), 400

    new_note = Note(content=content, user_id=session['user_id'])
    db.session.add(new_note)
    db.session.commit()

    return jsonify({
        'id': new_note.id, 
        'content': new_note.content, 
        'created_at': new_note.created_at.isoformat()
    }), 201

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
