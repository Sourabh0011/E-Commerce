import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import User from "../models/User";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;
  const clerkId = req.headers["x-clerk-id"];

  // Support Clerk ID directly for now to bridge the frontend/backend
  if (clerkId) {
    try {
      const user = await User.findOne({ clerkId });
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error("Clerk ID Auth Error:", error);
    }
  }

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (req.user) {
        return next();
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no valid credentials" });
  }
};
