//  ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle Forgot Password Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔁 Sending password reset link...");

    try {
      //  Use correct backend URL (Check PORT if different)
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      console.log(" Reset link sent:", res.data);
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      console.error("❌ Error:", error.response?.data?.error || "Unknown error");
      setMessage("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2> Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
