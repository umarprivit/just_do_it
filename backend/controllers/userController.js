import User from "../models/User.js";
import jwt from "jsonwebtoken";

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
    `<p>Your OTP is <strong>${otp}</strong>. It is valid for 20 seconds.</p>`
  );

  // Store in temp map
  const timeout = setTimeout(() => {
    pendingRegistrations.delete(email);
  }, 20000);

  pendingRegistrations.set(email, {
    data: { name, email, phone, password, role, skills },
    otp,
    timeout,
  });

  res.json({ message: "OTP sent. Please verify within 20 seconds." });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
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
    updates.passwordHash = await User.hashPassword(updates.password);
    delete updates.password;
  }

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

  const { name, phone, password, role, skills } = pending.data;
  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role,
    skills,
  });

  clearTimeout(pending.timeout);
  pendingRegistrations.delete(email);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};
