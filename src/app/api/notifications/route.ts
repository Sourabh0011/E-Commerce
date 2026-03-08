import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const notifications = await Notification.find({ user: user._id })
      .sort("-created_at")
      .limit(20);
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching notifications", error: error.message }, { status: 500 });
  }
}
