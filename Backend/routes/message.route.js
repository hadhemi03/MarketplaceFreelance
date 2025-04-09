import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { getMessages, getUsersForSidebar, sendMessage, startConversation, uploadMessageImage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/users", verifyToken, getUsersForSidebar);
router.get("/msg/:id", verifyToken, getMessages);
router.put("/send/:id", verifyToken, uploadMessageImage, sendMessage);
router.post("/start-conversation/:freelancerId", verifyToken, startConversation);


export default router;