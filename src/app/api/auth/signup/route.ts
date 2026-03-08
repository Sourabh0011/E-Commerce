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
    const { username, email, password } = await req.json();

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error during signup", error: error.message }, { status: 500 });
  }
}
