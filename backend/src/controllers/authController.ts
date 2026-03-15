import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { type IUser } from "../models/User";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "yoursecret", {
    expiresIn: "30d",
  });
};

// @desc    Forgot Password - Send reset token
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }) as IUser | null;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // In a real app, send an email with the token.
    // For now, we'll log it and simulate success.
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    // Construct reset URL (frontend should handle this route)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    console.log(`Reset URL: ${resetUrl}`);

    res.json({ message: "Password reset link sent to your email (Mocked)" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }) as IUser | null;

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// @desc    Sync Clerk user with MongoDB
// @route   POST /api/auth/sync
export const syncUser = async (req: Request, res: Response) => {
  const { clerkId, email, username, avatar_url } = req.body;

  try {
    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ 
      $or: [{ clerkId }, { email }] 
    });

    if (user) {
      user.clerkId = clerkId;
      if (avatar_url) user.avatar_url = avatar_url;
      await user.save();
      return res.json({ message: "User synced successfully", user });
    }

    user = await User.create({
      clerkId,
      email,
      username: username || email.split("@")[0],
      avatar_url,
      // No password for Clerk users
    });

    res.status(201).json({ message: "User created and synced", user });
  } catch (error: any) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Server error during sync", error: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/auth/signup
export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken((user._id as any).toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Detailed Signup Error:", error); // Added this for debugging
    res.status(500).json({ message: "Server error during signup", error: (error as any).message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await (user as any).comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken((user._id as any).toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Detailed Login Error:", error); // Added this for debugging
    res.status(500).json({ message: "Server error during login", error: (error as any).message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user" });
  }
};
