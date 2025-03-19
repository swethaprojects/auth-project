import React, { useState } from "react";
import { verifyOtp } from "../services/api";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(formData);
      alert(" OTP Verified Successfully!");
      navigate("/login"); 
    } catch (error) {
      console.error(" Error verifying OTP:", error);
      alert("Invalid OTP! Please try again.");
    }
  };

  return (
    <div>
      <h2> Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          onChange={handleChange}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
