import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import { getAnalytics, getMonthlyPayments } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Route to get all analytics data
router.get('/analytics',verifyToken, verifyAdmin, getAnalytics);

// Route to get monthly payments data
router.get('/monthly-payments',verifyToken, verifyAdmin, getMonthlyPayments);


export default router;