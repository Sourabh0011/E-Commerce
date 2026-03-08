import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
      });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 });
  }
}
