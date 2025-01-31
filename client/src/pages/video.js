import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useNavigate } from "react-router-dom";
const APP_ID = "bc8f887487c04ec28826c3a1c8d70285";
const TOKEN = "007eJxTYEh8xvb49D0G0Yrwox5GkxMYGZcfeBSp7jF72YqzH40zmo8rMCQlW6RZWJibWJgnG5ikJhtZWBiZJRsnGiZbpJgbGFmYVqXPSW8IZGSY1LmDiZEBAkF8FobcxMw8BgYAOOgfTA==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const Call = () => {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});
  const videoStreamRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerInterval);
  }, []);

  // Format the time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };
  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.removeAllListeners();
    };
  }, []);
  const videoRef = useRef(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("access_token");

    // If no user_id or access_token, redirect to auth page
    if (!storedUserId || !accessToken) {
      // window.location = "/auth";
      // return; // Prevent further codeexecution
    }

    setUserId(storedUserId); // Set the user_id dynamically from localStorage
    // Access the user's webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the webcam:", error);
      }
    };

    startCamera();

    // Cleanup on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const joinAndDisplayLocalStream = async () => {
    const UID = await client.join(APP_ID, CHANNEL, TOKEN, null);
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks(tracks);

    const player = `<div class="ministream"  id="user-container-${UID}">
                      <div class="video-player" id="user-${UID}"></div>
                    </div>`;
    videoStreamRef.current.insertAdjacentHTML("beforeend", player);

    tracks[1].play(`user-${UID}`);
    await client.publish([tracks[0], tracks[1]]);
  };

  const joinStream = async () => {
    await joinAndDisplayLocalStream();
    document.getElementById("join-btn").style.display = "none";
    document.getElementById("stream-controls").style.display = "flex";
  };

  const handleUserJoined = async (user, mediaType) => {
    setRemoteUsers((prevState) => ({ ...prevState, [user.uid]: user }));
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      const player = document.getElementById(`user-container-${user.uid}`);
      if (player != null) {
        player.remove(); // Remove existing player if any
      }

      const newPlayer = `<div class="video-container" id="user-container-${user.uid}">
                          <div class="video-player" id="user-${user.uid}"></div>
                        </div>`;
      videoStreamRef.current.insertAdjacentHTML("beforeend", newPlayer);
      user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers((prevState) => {
      const { [user.uid]: _, ...remainingUsers } = prevState;
      
      return remainingUsers;
    });
    const player = document.getElementById(`user-container-${user.uid}`);
    if (player) {
      player.remove(); // Clean up the removed user's video feed
    }
  };

  const leaveAndRemoveLocalStream = async () => {
    for (let i = 0; i < localTracks.length; i++) {
      localTracks[i].stop();
      localTracks[i].close();
    }

    await client.leave();
    document.getElementById("join-btn").style.display = "flex";
    document.getElementById("stream-controls").style.display = "none";
    videoStreamRef.current.innerHTML = "";
    navigate('/');
  };

  const toggleMic = async (e) => {
    if (localTracks[0].muted) {
      await localTracks[0].setMuted(false);
      e.target.classList.add("active");
      document.getElementById('mute').className = "fa-solid fa-microphone-slash";
    } else {
      await localTracks[0].setMuted(true);
      e.target.classList.remove("active");
      document.getElementById('mute').className = "fa-solid fa-microphone";
    }
  };

  const toggleCamera = async (e) => {
    if (localTracks[1].muted) {
      await localTracks[1].setMuted(false);
      e.target.classList.add("active");
      document.getElementById('cam').className = "fa-solid fa-video-slash";
      
    } else {
      await localTracks[1].setMuted(true);
      e.target.classList.remove("active");
      document.getElementById('cam').className = "fa-solid fa-video";
      
    }
  };
  return (
    <div className="home-main">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "99vh",
          objectFit: "cover",
          transform: "scaleX(-1)",
          filter: "brightness(0.5)",
        }}
      ></video>
      {/* <Ringer /> */}
      <div className="stream-home-details">
        <div>
          <div id="video-streams" ref={videoStreamRef}></div>

          <div
            id="stream-controls"
            className="call-controlss"
            style={{ display: "none" }}
          >
            <div className="left-icons">
              <button className="btn-left" id="mic-btn" onClick={toggleMic}>
                <i id="mute" className="fa-solid fa-microphone"></i>
              </button>
              <button
                className="btn-left"
                id="camera-btn"
                onClick={toggleCamera}
              >
                <i id="cam"  className="fa-solid fa-video"></i>
              </button>
            </div>

            <div className="runtime-calc">
              <span className="runtime">{formatTime(timeElapsed)}</span>
            </div>
            <button
              className="btn-left"
              id="leave-btn"
              onClick={leaveAndRemoveLocalStream}
            >
              <i class="fa-solid fa-phone-flip"></i>
            </button>
          </div>

          <button id="join-btn" onClick={joinStream}>
            <i class="fa-solid fa-phone"></i>
            <span className="joinfeed">Join</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Call;
