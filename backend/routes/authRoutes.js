import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ============================
//  Utility: Generate JWT Token
// ============================
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

//  Rate Limit Map to avoid multiple OTPs
const otpRateLimit = new Map(); // { email: timestamp }

// ============================
//  Login with OTP Logic
// ============================
router.post("/login", async (req, res) => {
  const { email, password, otp } = req.body;
  console.log("💡 Login request for:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Check if OTP is provided (Verification Stage)
    if (otp) {
      if (Date.now() > user.otpExpires) {
        return res.status(400).json({ error: "OTP has expired. Please request a new one." });
      }

      if (String(user.otp) !== String(otp)) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
      }

      //  Mark user verified after OTP success
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      // Generate JWT after successful OTP verification
      const token = generateToken(user);

      return res.json({
        message: "Login successful after OTP!",
        token,
      });
    }

    //  Check if user is verified before allowing login
    if (!user.isVerified) {
      console.log("User not verified. Sending OTP...");

      // Rate limiting: Avoid multiple OTP requests within 2 mins
      const lastSentTime = otpRateLimit.get(email);
      if (lastSentTime && Date.now() - lastSentTime < 120000) {
        return res.status(429).json({ error: " Wait 2 mins before requesting another OTP." });
      }

      //  Generate OTP & Save
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otpCode;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
      await user.save();
      otpRateLimit.set(email, Date.now());

      //  Send OTP via Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otpCode}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(" OTP Sent Successfully!");
      return res.json({ message: "OTP sent successfully! Please verify OTP." });
    }

    //  Verify password if user is already verified
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    //  Generate JWT after successful password login
    const token = generateToken(user);

    res.json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error(" Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
