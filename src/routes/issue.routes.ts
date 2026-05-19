import { Router } from "express";
import { getStudentsWithBooks, issueBook, pendingBooks, returnBook } from "../controllers/issue.controller";

const router = Router();

router.post("/issueBook", issueBook);
router.get("/getStudentsWithBooks", getStudentsWithBooks);
router.put("/return", returnBook);
router.put("/pendingBooks", pendingBooks);

export default router;