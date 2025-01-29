import io from "socket.io-client";

// Connect to the signaling server
const socket = io("http://localhost:3001");

export default socket;
