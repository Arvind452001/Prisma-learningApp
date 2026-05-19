import { Router } from "express";
import { createBook, getBooks } from "../controllers/book.controller";

const router = Router();

router.post("/create", createBook);
router.get("/getBooks", getBooks);

export default router;