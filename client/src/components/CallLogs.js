import React, { useEffect, useState } from "react";

const CallLogs = ({ userId }) => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch call logs from the API
    fetch(`http://127.0.0.1:5000/call-logs/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Sort the call logs by the latest one (most recent)
        const sortedLogs = data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        setCallLogs(sortedLogs); // Set the sorted call logs
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching call logs:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [userId]);

  if (loading) {
    return <p>Loading call logs...</p>;
  }

  return (
    <div>
      {callLogs.length > 0 ? (
        callLogs.map((log) => (
          <div className="log_container" key={log.call_id}>
            <div className="log_image">
              <div className="initial">
                {log.receiver_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="log_detailed">
              <div className="user-name">{log.receiver_name}</div>
              <div className="log-time">
                {new Date(log.start_time).toLocaleDateString()}
              </div>
            </div>
            <div className="call-btn">
              <i className="fa-solid fa-video"></i>
              <span>Call</span>
            </div>
          </div>
        ))
      ) : (
        <p>No call logs found.</p>
      )}
    </div>
  );
};

export default CallLogs;
