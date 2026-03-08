import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { verifyAuth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    await connectDB();
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (
      transaction.seller.toString() !== user._id.toString() &&
      transaction.buyer.toString() !== user._id.toString()
    ) {
      return NextResponse.json({ message: "User not authorized" }, { status: 401 });
    }

    transaction.status = status;
    await transaction.save();

    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating transaction", error: error.message }, { status: 500 });
  }
}
