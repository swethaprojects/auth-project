import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP is sent
  const navigate = useNavigate(); // React Router navigate hook

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Handle Login Request (Send OTP if Needed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      //  Handle OTP Response
      if (res.data.message === "OTP sent successfully! Please verify OTP.") {
        alert(" OTP sent to your email. Please enter the OTP.");
        setOtpRequested(true);
      } else if (res.data.token) {
        //  Successful Login After OTP or Verified User
        alert(" Login Successful!");
        sessionStorage.setItem("token", res.data.token);
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      alert(error.response?.data?.error || "❌ Login failed! Please try again.");
    }
  };

  //  Verify OTP if Requested
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (res.data.token) {
        alert(" OTP Verified & Login Successful!");
        sessionStorage.setItem("token", res.data.token);
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      alert(error.response?.data?.error || "❌ OTP Verification failed.");
    }
  };

  return (
    <div className="container">
      <h2> Login with OTP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {otpRequested && (
          <div>
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        )}

        {!otpRequested && (
          <button type="submit">
            {otpRequested ? "Verify OTP & Login" : "Login"}
          </button>
        )}
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
