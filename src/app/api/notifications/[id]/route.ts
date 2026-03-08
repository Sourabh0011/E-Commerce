import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    if (notification.user.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "User not authorized" }, { status: 401 });
    }

    notification.is_read = true;
    await notification.save();

    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating notification", error: error.message }, { status: 500 });
  }
}
