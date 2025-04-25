import express from "express";
import { verifyClient, verifyToken } from "../utils/verifyToken.js";
import { getFreelancerRating, rateFreelancer } from "../controllers/rating.controller.js";


const router = express.Router();

router.post("/rate/:freelancerId", verifyToken, verifyClient, rateFreelancer);
router.get("/avg/:freelancerId", verifyToken, getFreelancerRating);

export default router;