import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import Notification from "@/lib/models/Notification";
import Book from "@/lib/models/Book";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const transactions = await Transaction.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
    })
      .populate("book")
      .populate("buyer", "username email")
      .populate("seller", "username email")
      .sort("-created_at");

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching transactions", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { bookId, sellerId, type, paymentMethod, address_line, city, state, pincode, phone } = await req.json();

    await connectDB();
    const book = await Book.findById(bookId);
    if (!book) return NextResponse.json({ message: "Book not found" }, { status: 404 });

    const transaction = await Transaction.create({
      book: bookId,
      buyer: user._id,
      seller: sellerId,
      type,
      payment_method: paymentMethod,
      address_line,
      city,
      state,
      pincode,
      phone,
    });

    // Create Notification for Seller
    await Notification.create({
      user: sellerId,
      title: "New Order Received! 🎉",
      message: `Someone wants to buy "${book.title}" for ₹${book.price}. Payment: ${paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}.`,
      related_transaction: transaction._id,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Create Transaction Error:", error);
    return NextResponse.json({ message: "Error creating transaction", error: error.message }, { status: 500 });
  }
}
