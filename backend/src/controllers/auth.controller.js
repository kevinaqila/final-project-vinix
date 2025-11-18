import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      role,
    });

    await newUser.save();
    const token = generateToken(newUser._id);
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};

export const verifyToken = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
