import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { getConversationsForUser, getMessagesByProject, markMessagesAsSeen, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/project/:projectId", verifyToken, getMessagesByProject);
router.get("/conversations", verifyToken, getConversationsForUser);
router.put("/seen/:projectId", verifyToken, markMessagesAsSeen)

export default router;