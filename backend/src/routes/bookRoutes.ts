import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary";
import { createBook, getBooks, getMyBooks, deleteBook, getSingleBook } from "../controllers/bookController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({ storage });

router.get("/", getBooks);
router.post("/", protect, upload.single("image"), createBook);
router.get("/my", protect, getMyBooks);
router.get("/:id", getSingleBook);
router.delete("/:id", protect, deleteBook);

export default router;

