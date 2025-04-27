import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();


router.get("/get-notif", verifyToken, getNotifications);

export default router;