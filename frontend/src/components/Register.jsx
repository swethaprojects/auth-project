import React, { useState } from "react";
import { registerUser, sendOtp } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Send OTP after registration
  const handleSendOtp = async (email) => {
    try {
      console.log(`Sending OTP to: ${email}`);
      await sendOtp(email);
      setOtpSent(true);
      alert(" OTP sent to your email!");
    } catch (error) {
      console.error(" Error sending OTP:", error.response?.data || error);
      alert("Error sending OTP. Please try again!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering user...");
      const data = await registerUser(formData);
      alert("🎉 User Registered Successfully!");
      console.log(" User Registered:", data);

      //  Send OTP after successful registration
      await handleSendOtp(formData.email);

      // Redirect to OTP verification page
      navigate("/verify");
    } catch (error) {
      console.error(" Error registering user:", error.response?.data || error);
      alert("Error registering user. Please try again!");
    }
  };

  return (
    <div>
      <h2> Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
