import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = "bc8f887487c04ec28826c3a1c8d70285";
const TOKEN = "007eJxTYFjSYHS2qJjN1nrW/B13Iy++4BJSi9eovB1m/uFi9xO1TikFhqRkizQLC3MTC/NkA5PUZCMLCyOzZONEw2SLFHMDIwtThkUz0hsCGRksjTYyMTJAIIjPwpCbmJnHwAAA/TwdzQ==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const Call = () => {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});
  const videoStreamRef = useRef(null);

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.removeAllListeners();
    };
  }, []);

  const joinAndDisplayLocalStream = async () => {
    const UID = await client.join(APP_ID, CHANNEL, TOKEN, null);
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks(tracks);

    const player = `<div class="video-container" id="user-container-${UID}">
                      <div class="video-player" id="user-${UID}"></div>
                    </div>`;
    videoStreamRef.current.insertAdjacentHTML('beforeend', player);

    tracks[1].play(`user-${UID}`);
    await client.publish([tracks[0], tracks[1]]);
  };

  const joinStream = async () => {
    await joinAndDisplayLocalStream();
    document.getElementById('join-btn').style.display = 'none';
    document.getElementById('stream-controls').style.display = 'flex';
  };

  const handleUserJoined = async (user, mediaType) => {
    setRemoteUsers(prevState => ({ ...prevState, [user.uid]: user }));
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      const player = document.getElementById(`user-container-${user.uid}`);
      if (player != null) {
        player.remove();
      }

      const newPlayer = `<div class="video-container" id="user-container-${user.uid}">
                           <div class="video-player" id="user-${user.uid}"></div>
                         </div>`;
      videoStreamRef.current.insertAdjacentHTML('beforeend', newPlayer);

      user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prevState => {
      const { [user.uid]: _, ...remainingUsers } = prevState;
      return remainingUsers;
    });
    document.getElementById(`user-container-${user.uid}`).remove();
  };

  const leaveAndRemoveLocalStream = async () => {
    for (let i = 0; i < localTracks.length; i++) {
      localTracks[i].stop();
      localTracks[i].close();
    }

    await client.leave();
    document.getElementById('join-btn').style.display = 'block';
    document.getElementById('stream-controls').style.display = 'none';
    videoStreamRef.current.innerHTML = '';
  };

  const toggleMic = async (e) => {
    if (localTracks[0].muted) {
      await localTracks[0].setMuted(false);
      e.target.innerText = 'Mic on';
      e.target.style.backgroundColor = 'cadetblue';
    } else {
      await localTracks[0].setMuted(true);
      e.target.innerText = 'Mic off';
      e.target.style.backgroundColor = '#EE4B2B';
    }
  };

  const toggleCamera = async (e) => {
    if (localTracks[1].muted) {
      await localTracks[1].setMuted(false);
      e.target.innerText = 'Camera on';
      e.target.style.backgroundColor = 'cadetblue';
    } else {
      await localTracks[1].setMuted(true);
      e.target.innerText = 'Camera off';
      e.target.style.backgroundColor = '#EE4B2B';
    }
  };

  return (
    <div>
      <div id="video-streams" ref={videoStreamRef}></div>

      <div id="stream-controls" style={{ display: 'none' }}>
        <button id="mic-btn" onClick={toggleMic}>Mic on</button>
        <button id="camera-btn" onClick={toggleCamera}>Camera on</button>
        <button id="leave-btn" onClick={leaveAndRemoveLocalStream}>Leave</button>
      </div>

      <button id="join-btn" onClick={joinStream}>Join</button>
    </div>
  );
};

export default Call;
