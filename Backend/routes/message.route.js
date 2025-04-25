import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();

// Route to send a message
router.post("/send-msg",  sendMessage);
router.get("/get-msg/:userId", verifyToken, getMessages)

export default router;
