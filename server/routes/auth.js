import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_EXPIRY = "7d";

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, role, timezone, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: "fullName, email and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      phone,
      role,
      timezone,
      passwordHash
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        timezone: user.timezone
      }
    });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        timezone: user.timezone
      }
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      timezone: user.timezone
    });
  } catch (err) {
    console.error("Me error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/auth/me
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { fullName, phone, role, timezone } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (timezone !== undefined) updateData.timezone = timezone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      timezone: user.timezone
    });
  } catch (err) {
    console.error("Update profile error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


