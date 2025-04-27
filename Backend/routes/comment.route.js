import express from "express";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";
import { addComment, deleteComment, getAllComments, getCommentsByProject, updateComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/add-comment/:projectId", verifyToken, addComment);
router.get("/getCommentsByProject/:projectId", verifyToken, getCommentsByProject);
router.get("/get-all-comments", verifyToken, verifyAdmin, getAllComments);
router.put("/update-comment/:commentId", verifyToken, updateComment);
router.delete("/delete-comment/:commentId", verifyToken, deleteComment);

export default router;