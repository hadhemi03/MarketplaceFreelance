import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { addComment, getCommentsByProject } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/add-comment/:projectId", verifyToken, addComment);
router.get("/getCommentsByProject/:projectId", verifyToken, getCommentsByProject);

export default router;