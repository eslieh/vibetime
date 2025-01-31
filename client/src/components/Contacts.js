import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Contacts = ({ userId, onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate(); // Initialize the navigate hook

  // Fetch contacts from the API
  useEffect(() => {
    fetch("https://s4h0dqdd-5000.uks1.devtunnels.ms/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      });
  }, []);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedContact(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };


  const handleCallUser = () => {
    const callLog = {
      caller_id: userId,
      receiver_id: selectedContact.id,
    };

    const callListener = {
      initiator_id: userId,
      receiver_id: selectedContact.id,
      status: "ringing", // Initial status, could be updated to "on call" later
    };

    // First, post the CallListener data
    fetch("https://s4h0dqdd-5000.uks1.devtunnels.ms/call-listener", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(callListener),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`Failed to save call listener: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        // Then, post the CallLog data
        return fetch("https://s4h0dqdd-5000.uks1.devtunnels.ms/call-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(callLog),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to save call log: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        // Navigate to the video call page with the receiver's ID
        navigate(`/video/${selectedContact.id}`);
      })
      .catch((error) => {
        console.error("Error saving call data:", error);
        alert("Failed to save call data.");
      });
  };


  const filteredContacts = contacts.filter(
    (contact) =>
      contact.id !== userId && contact.username.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="contact_cardpop">
      <div className="exit-bitn" onClick={onClose}>
        <span className="cancel_text">Cancel</span>
      </div>
      <h3 className="label">New Vibetime</h3>
      <div className="addandsearch">
        <input
          className="input-text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="addbtn">+</button>
      </div>
      <div className="contact-lists">
        <span className="conat">Contacts</span>
        <div className="contacti_my_list">
          {loading ? (
            <p>Loading contacts...</p>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                className="comtact-cont"
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                style={{ cursor: "pointer" }}
              >
                <div className="initiallabel">
                  {contact.username.charAt(0).toUpperCase()}
                </div>
                <div className="contact-names">{contact.username}</div>
              </div>
            ))
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h4>Confirm Call</h4>
            <p>Do you wanna call {selectedContact.username}?</p>
            <div className="popup-actions">
              <button className="action-det" id="decline" onClick={closePopup}>
                <i className="fa-solid fa-phone-flip"></i>
              </button>
              <button className="action-det" id="accept" onClick={handleCallUser}>
                <i className="fa-solid fa-phone"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
