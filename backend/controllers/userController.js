import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Make sure you have this installed
import { sendEmail } from "../utils/email.js";

// utils/tempStore.js
let pendingRegistrations = new Map();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, phone, password, role, skills } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists || pendingRegistrations.has(email)) {
    return res
      .status(400)
      .json({ error: "User already exists or pending verification" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Send OTP
  await sendEmail(
    email,
    "Tasker Email OTP",
    `Your OTP is ${otp}`,
    `<p>Your OTP is <strong>${otp}</strong>. It is valid for 30 seconds.</p>`
  );

  // Store in temp map
  console.log("OTP FOR ", email, "is ", otp);
  const timeout = setTimeout(() => {
    pendingRegistrations.delete(email);
  }, 30000);

  pendingRegistrations.set(email, {
    data: { name, email, phone, password, role, skills },
    otp,
    timeout,
  });

  res.json({ message: "OTP sent. Please verify within 30 seconds." });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials - User not found" });
    }

    // Try bcrypt compare
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (isPasswordValid) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid credentials - Wrong password" });
    }
  } catch (error) {
    console.log("error in login method ", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = req.user;
  const updates = req.body;

  if (updates.password) {
    // Validate password
    if (updates.password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    updates.passwordHash = await bcrypt.hash(updates.password, salt);

    updates.passwordHash = user.passwordHash;

    delete updates.password;
  }
  // Remove plain password from updates

  Object.assign(user, updates);
  await user.save();
  res.json(user);
};

// Search providers
export const searchProviders = async (req, res) => {
  const { category, skill } = req.query;
  let query = { role: "provider", isVerified: true };

  if (skill) query.skills = { $regex: skill, $options: "i" };
  if (category) query.skills = { $regex: category, $options: "i" };

  const providers = await User.find(query).select("-passwordHash");
  res.json(providers);
};

export const verifyOtpAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;

  const pending = pendingRegistrations.get(email);
  if (!pending) {
    return res
      .status(400)
      .json({ error: "No pending registration or OTP expired" });
  }

  if (pending.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Clear the timeout
  clearTimeout(pending.timeout);
  pendingRegistrations.delete(email);

  try {
    const { name, email, phone, password, role, skills } = pending.data;
    // split skills by comma and trim whitespace
    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with the hashed password
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash, // Use the hash we just created
      role,
      skills: role === "provider" ? skillsArray : [],
      isVerified: true,
      rating: 0,
      reviewCount: 0,
      points: 0,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("User creation error:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
};
