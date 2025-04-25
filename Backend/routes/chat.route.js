import express from "express";
import { createOrGetChat, getUserChats } from "../controllers/chat.controller.js";


const router = express.Router();

// Route to create or get an existing chat
router.post("/get-or-create-chat" , createOrGetChat);
router.get("/user/:userId", getUserChats);

export default router;
