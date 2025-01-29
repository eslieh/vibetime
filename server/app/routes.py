from app import app, db
from flask import request, jsonify
from app.models import User, CallLog, Contact
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy.orm import joinedload

@app.route('/')
def Home():
    return "Hello"
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']
    new_user = User(username=username, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        access_token = create_access_token(identity={'user_id': user.id})
        return jsonify(access_token=access_token, user_id=user.id), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/contacts', methods=['GET'])
def get_contacts():
    user_id = 1  # This should be fetched from the authenticated user context (e.g., via JWT)
    contacts = Contact.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': contact.id,
        'contact_name': contact.contact_name,
        'contact_email': contact.contact_email
    } for contact in contacts])

@app.route('/contacts', methods=['POST'])
def add_contact():
      # Again, fetch this from the authenticated user context
    contact_data = request.get_json()
    user_id = contact_data.get('user_id')
    contact_name = contact_data.get('contact_name')
    contact_email = contact_data.get('contact_email')

    # Check if the contact email already exists
    existing_contact = Contact.query.filter_by(contact_email=contact_email).first()
    if existing_contact:
        return jsonify({'message': 'Contact with this email already exists'}), 400

    new_contact = Contact(user_id=user_id, contact_name=contact_name, contact_email=contact_email)
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({
        'id': new_contact.id,
        'contact_name': new_contact.contact_name,
        'contact_email': new_contact.contact_email
    }), 201

@app.route('/call-log', methods=['POST'])
# @jwt_required()
def add_call_log():
    data = request.get_json()
    caller_id = data['caller_id']
    receiver_id = data['receiver_id']
    start_time = datetime.utcnow()
    end_time = datetime.utcnow()  # This will be updated later, for now just a placeholder
    call_log = CallLog(caller_id=caller_id, receiver_id=receiver_id, start_time=start_time, end_time=end_time)
    db.session.add(call_log)
    db.session.commit()
    return jsonify({"message": "Call log saved"}), 201

@app.route('/call-logs/<int:user_id>', methods=['GET'])
def get_call_logs(user_id):
    try:
        # Fetch call logs where the user is either the caller or receiver
        call_logs = CallLog.query.filter(
            (CallLog.caller_id == user_id) | (CallLog.receiver_id == user_id)
        ).all()

        if not call_logs:
            return jsonify({"message": "No call logs found for this user"}), 404

        # Format the response
        formatted_logs = []
        for log in call_logs:
            caller = User.query.get(log.caller_id)
            receiver = User.query.get(log.receiver_id)

            formatted_logs.append({
                "call_id": log.id,
                "caller_id": log.caller_id,
                "caller_name": caller.username if caller else "Unknown",
                "caller_email": caller.email if caller else "Unknown",
                "receiver_id": log.receiver_id,
                "receiver_name": receiver.username if receiver else "Unknown",
                "receiver_email": receiver.email if receiver else "Unknown",
                "start_time": log.start_time.isoformat(),
                "end_time": log.end_time.isoformat()
            })

        return jsonify(formatted_logs), 200
    except Exception as e:
        print(f"Error fetching call logs: {e}")
        return jsonify({"error": "Failed to fetch call logs"}), 500
    
@app.route('/users', methods=['GET'])
def get_all_users():
    try:
        # Query all users from the database
        users = User.query.all()
        
        # Serialize user data into a list of dictionaries
        user_list = [
            {"id": user.id, "username": user.username, "email": user.email}
            for user in users
        ]
        
        return jsonify(user_list), 200  # Return the user list as JSON
    except Exception as e:
        # Handle any exceptions and return an error response
        return jsonify({"error": "Failed to fetch users", "message": str(e)}), 500
