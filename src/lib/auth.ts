import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    await connectDB();
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}
