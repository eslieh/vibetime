import React, { useEffect, useRef, useState } from "react";
import Tone from "../ringtone/vibetime.mp3";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // To make API requests

const Ringer = ({ onDecline, incomingCall }) => {
    const audioRef = useRef(null);
    const [playBlocked, setPlayBlocked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const playAudio = async () => {
            try {
                await audioRef.current.play();
            } catch (error) {
                console.error("Autoplay blocked:", error);
                setPlayBlocked(true); // Show button to enable audio
            }
        };

        if (audioRef.current) {
            playAudio();
        }
    }, []);

    const enableAudio = async () => {
        try {
            await audioRef.current.play();
            setPlayBlocked(false);
        } catch (error) {
            console.error("Error enabling audio:", error);
        }
    };

    const updateCallStatus = async (status) => {
        try {
            const response = await axios.delete(`https://s4h0dqdd-5000.uks1.devtunnels.ms/call-listener/${incomingCall.id}`, {
                status: status, // Update the status based on the action (accept/reject)
            });
            console.log("Call status updated:", response.data);
        } catch (error) {
            console.error("Error updating call status:", error);
        }
    };

    const handleDecline = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset audio to start
        }
        updateCallStatus("rejected"); // Update status to rejected
        onDecline(); // Call onDecline function passed as prop to remove the Ringer component
    };

    const handleAccept = () => {
        // updateCallStatus("on-call"); // Update status to on-call
        navigate('/video/1'); // Navigate to the video call page
    };

    return (
        <div className="ringer-pop">
            <audio ref={audioRef} src={Tone} loop hidden></audio>

            {playBlocked && (
                <button onClick={enableAudio} className="enable-audio">
                    Enable Ringtone
                </button>
            )}

            <div className="call-details">
                <div className="image-place-ic">
                    <div className="Inititalplat">{incomingCall.initiator_name.charAt(0).toUpperCase()}</div>
                </div>
                <div className="caller-details">
                    <div className="about-coall">VibeTime</div>
                    <div className="user-full-names">{incomingCall.initiator_name}</div>
                </div>
                <div className="action-buttons">
                    <button className="action-det" id="decline" onClick={handleDecline}>
                        <i className="fa-solid fa-phone-flip"></i>
                    </button>
                    <button className="action-det" id="accept" onClick={handleAccept}>
                        <i className="fa-solid fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ringer;
