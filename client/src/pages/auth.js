import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("access_token");
  
  console.log("user_id:", userId);
  console.log("access_token:", accessToken);
  
  if (userId && accessToken) {
    window.location.href = "/"; // Redirect to home page
  }
  
  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "", name: "" });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "/login" : "/signup";

    // Update payload for signup and login
    const payload = isLogin
      ? { username: formData.name, password: formData.password } // Login with email and password
      : { username: formData.name, email: formData.email, password: formData.password }; // Signup with username, email, and password
    console.log(payload);

    try {
      const response = await axios.post(`https://s4h0dqdd-5000.uks1.devtunnels.ms${endpoint}`, payload);
      const { user_id, access_token } = response.data;

      // Store data in localStorage
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("access_token", access_token);

      alert(isLogin ? "Login successful!" : "Signup successful!");
      window.location.href="/";
      // Check if user_id and access_token are available
      
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f7",
        fontFamily: "'SF Pro Text', sans-serif",
      }}
    >
      <div
        className="auth-card"
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {isLogin ? "Log In" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
                <div style={{ marginBottom: "1rem" }}>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    fontSize: "1rem",
                }}
                required
                />
            </div>
          
          )}
          <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Username"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
                required
              />
            </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "1rem",
              }}
              required
            />
          </div>
          {error && (
            <div
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#0071e3",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0071e3")}
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            style={{
              color: "#0071e3",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={toggleAuthMode}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
