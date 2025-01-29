export const createPeerConnection = (localStream, remoteUserId, socket) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: remoteUserId,
        });
      }
    };
  
    peerConnection.ontrack = (event) => {
      return event.streams[0];
    };
  
    return peerConnection;
  };
  