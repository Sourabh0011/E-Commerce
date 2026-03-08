import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Book from "@/lib/models/Book";
import { verifyAuth } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (book.user.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "User not authorized" }, { status: 401 });
    }

    await book.deleteOne();
    return NextResponse.json({ message: "Book removed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting book", error: error.message }, { status: 500 });
  }
}
