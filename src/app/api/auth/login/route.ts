import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "yoursecret", {
    expiresIn: "30d",
  });
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server error during login", error: error.message }, { status: 500 });
  }
}
