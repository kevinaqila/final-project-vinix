import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id); 
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const isFreelancer = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Access denied. Freelancer role required." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const isClient = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: "Access denied. Client role required." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};