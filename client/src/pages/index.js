import React, { useRef, useEffect, useState } from "react";
import Ringer from "../components/Ringer";
import Contacts from "../components/Contacts";
import CallLogs from "../components/CallLogs";
import ParentComponent from "../components/ParentalComponent";

const Index = () => {
  const [showContacts, setShowContacts] = useState(false); // State to toggle Contacts
  const [userId, setUserId] = useState(null); // To pass user_id dynamically
  const [isRinging, setIsRinging] = useState(false); // Initially no incoming call
  const [incomingCall, setIncomingCall] = useState(null); // To store incoming call details
  const videoRef = useRef(null);

  const handleDecline = () => {
    setIsRinging(false); // Hide the Ringer component when declined
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("access_token");

    // If no user_id or access_token, redirect to auth page
    if (!storedUserId || !accessToken) {
      window.location = "/auth";
      return; // Prevent further code execution
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

    // Poll for incoming calls
    const callPollInterval = setInterval(() => {
      if (!storedUserId) return;
      // Make a GET request to check for incoming calls for the user
      fetch(`https://s4h0dqdd-5000.uks1.devtunnels.ms/call-listener/${storedUserId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data); // Log API response for debugging

          if (data && data.receiver_id === parseInt(storedUserId)) {
            

            // If an incoming call is found, update the state
            if (data.status == "ringing") {
              setIsRinging(true); // Show the Ringer component if a call is waiting
              setIncomingCall(data); // Store incoming call details
            } else {
              setIsRinging(false); // Hide the Ringer if no call is waiting
              setIncomingCall(null);
            }
          } else {
            setIsRinging(false); // Hide the Ringer if no listeners
            setIncomingCall(null);
          }
        })
        .catch((error) =>
          console.error("Error fetching call listeners:", error)
        );
    }, 5000); // Poll every 5 seconds (adjust as needed)

    // Cleanup on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      clearInterval(callPollInterval); // Clean up polling on unmount
    };
  }, []);

  // Handle "Contacts" button click
  const handleContactsClick = () => {
    setShowContacts(true); // Show the Contacts component
  };

  // Handle "New Vibetime" button click
  const handleNewVibetimeClick = () => {
    setShowContacts(true); // Show the Contacts component (optional)
    console.log("Starting a new Vibetime!");
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
      {isRinging && (
        <Ringer onDecline={handleDecline} incomingCall={incomingCall} />
      )}
      <div className="main-home-details">
        <div className="float-left-contents">
          <div className="float-main-class">
            <div className="icon-logo">vibetime</div>
          </div>
          <div className="new-call-btn">
            <div className="buttton-section">
              <button className="details-pull" onClick={handleContactsClick}>
                <i className="fa-solid fa-user-group"></i>
                <span className="icon-bttnslabel">Contacts</span>
              </button>
              <button
                className="details-pull"
                id="accept"
                onClick={handleNewVibetimeClick}
              >
                <i className="fa-solid fa-video"></i>
                <span className="icon-bttnslabel">New Vibetime</span>
              </button>
            </div>
          </div>
          {showContacts && userId && <ParentComponent userId={userId} />}
          <div className="calllogs_labelee">Recent Calls</div>
          <div className="call_logs">
            <CallLogs userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
