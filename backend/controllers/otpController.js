import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import nodemailer from "nodemailer";

// Generate OTP and Send Email
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
    await user.save();

    // Send OTP via Email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiration = null;
  await user.save();

  res.status(200).json({ message: "OTP verified successfully" });
};
