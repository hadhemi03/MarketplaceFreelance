import express from 'express';
import { verifyAdmin, verifyClient, verifyFreelancer, verifyToken } from '../utils/verifyToken.js';
import { createPaymentIntent, getAllPayments, getClientPayments, getFreelancerPayments, savePayment, updatePaymentStatus } from '../controllers/payment.controller.js';

const router = express.Router();


router.post("/create-payment-intent", verifyToken, verifyClient, createPaymentIntent);
router.post("/update-payment-status", updatePaymentStatus);
router.post("save", savePayment);

//get history
router.get("/:clientId/payment-client", verifyToken, verifyClient, getClientPayments);
router.get("/:freelancerId/payment-freelancer", verifyToken, verifyFreelancer, getFreelancerPayments);
router.get("/all-payments", verifyToken, verifyAdmin, getAllPayments);

export default router;