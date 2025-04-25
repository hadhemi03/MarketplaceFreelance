import express from "express";
import { verifyClient, verifyFreelancer, verifyToken } from "../utils/verifyToken.js";
import { acceptOffer, createOffer, getFreelancerOffers, rejectOffer } from "../controllers/offer.controller.js";

const router = express.Router();

router.post("/make-offer", verifyToken, verifyClient, createOffer);
router.get("/my-offers", verifyToken, verifyFreelancer, getFreelancerOffers);
router.put("/:offerId/accept", verifyToken, verifyFreelancer, acceptOffer);
router.put("/:offerId/reject", verifyToken, verifyFreelancer, rejectOffer);

export default router;