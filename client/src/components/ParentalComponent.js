import React, { useState } from "react";
import Contacts from "./Contacts"; // Assuming the Contacts component is in the same directory

const ParentComponent = ({userId}) => {
  const [showContacts, setShowContacts] = useState(true); // Manage visibility of Contacts component

  const handleCloseContacts = () => {
    setShowContacts(false); // Hide the Contacts component
  };

  return (
    <div>
      {showContacts && <Contacts userId={userId} onClose={handleCloseContacts} />} {/* Pass userId and onClose prop */}
      {/* You can add other components or content here */}
    </div>
  );
};

export default ParentComponent;
