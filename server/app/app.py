from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

# Sample endpoint
@app.route('/')
def hello():
    return "Hello from Flask!"

# Video call signaling
@socketio.on('join')
def handle_join(data):
    print(f"User {data['username']} joined room: {data['room']}")
    emit('joined', {'message': f'User {data["username"]} has joined the room'}, room=data['room'])

@socketio.on('offer')
def handle_offer(data):
    emit('offer', data, room=data['room'])

@socketio.on('answer')
def handle_answer(data):
    emit('answer', data, room=data['room'])

@socketio.on('candidate')
def handle_candidate(data):
    emit('candidate', data, room=data['room'])

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
