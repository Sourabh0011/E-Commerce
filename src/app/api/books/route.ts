import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Book from "@/lib/models/Book";
import { verifyAuth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find().populate("user", "username avatar_url").sort("-created_at");
    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching books", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const price = formData.get("price") as string;
    const is_swap = formData.get("is_swap") === "true";
    const condition = formData.get("condition") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;

    let image_url = "";
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "bookswap",
      });
      image_url = uploadResponse.secure_url;
    }

    await connectDB();
    const book = await Book.create({
      user: user._id,
      title,
      author,
      price: is_swap ? null : Number(price),
      is_swap,
      condition,
      category,
      description,
      image_url,
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error("Create Book Error:", error);
    return NextResponse.json({ message: "Error creating book listing", error: error.message }, { status: 500 });
  }
}
