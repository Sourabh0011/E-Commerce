import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Book from "@/lib/models/Book";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const books = await Book.find({ user: user._id }).sort("-created_at");
    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching your books", error: error.message }, { status: 500 });
  }
}
