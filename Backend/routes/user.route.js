import express from "express";
import { verifyAdmin, verifyFreelancer, verifyToken } from "../utils/verifyToken.js";
import { createUser, deleteUser, getAllFreelancers, getAllUsers, getCurrentUser, getFreelancerById, getUserById, updateUser, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();


router.post("/create-user", verifyAdmin, createUser);
router.put("/update-user/:userId", verifyAdmin, updateUser);
router.delete("/delete-user/:userId", verifyAdmin, deleteUser);
router.get("/get-user/:userId", verifyToken, verifyAdmin, getUserById);
router.get("/get-all-users", verifyAdmin, getAllUsers);

router.put("/update-userProfile", verifyToken, verifyFreelancer, updateUserProfile);
router.get("/get-freelancerByid/:freelancerId", verifyToken, getFreelancerById);
router.get("/get-all-freelancers", verifyToken, getAllFreelancers);

router.get("/get-current-user", verifyToken, getCurrentUser);



export default router;