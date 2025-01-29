import React, { useRef, useEffect, useState } from "react";
import Ringer from "../components/Ringer";
import Contacts from "../components/Contacts";
import CallLogs from "../components/CallLogs";
import ParentComponent from "../components/ParentalComponent";

const Index = () => {
  const [showContacts, setShowContacts] = useState(false); // State to toggle Contacts
  const [userId, setUserId] = useState(null); // To pass user_id dynamically

  const videoRef = useRef(null);
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

    // Cleanup on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
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
      {/* <Ringer /> */}
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
          {showContacts && userId && (
            // Render the Contacts component when showContacts is true and userId is available
            <ParentComponent userId={userId} />
          )}
          <div className="calllogs_labelee">Recent Calls</div>
          <div className="call_logs">
            <CallLogs userId={userId}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
