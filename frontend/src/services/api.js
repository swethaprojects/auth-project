// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

//  Register User
export const registerUser = async (formData) => {
  const res = await axios.post(`${API_URL}/register`, formData);
  return res.data;
};

//  Send OTP
export const sendOtp = async (email) => {
  const res = await axios.post(`${API_URL}/send-otp`, { email });
  return res.data;
};

//  Verify OTP
export const verifyOtp = async (formData) => {
  const res = await axios.post(`${API_URL}/verify-otp`, formData);
  return res.data;
};

//  Login
export const loginUser = async (formData) => {
  const res = await axios.post(`${API_URL}/login`, formData);
  return res.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password`, { email });
  return res.data;
};
