import express from "express";
import { verifyAdmin, verifyFreelancer, verifyToken } from "../utils/verifyToken.js";
import { addClient, addFreelancer, createUser, deleteUser, getAllClients, getAllFreelancers, getAllUsers, getCurrentUser, getFreelancerById, getUserById, getUsersWithChats, updateClient, updateFreelancer, updateUser, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();


router.post("/create-user", verifyAdmin, createUser);
router.post("/add-freelancer", verifyAdmin, addFreelancer);
router.post("/add-client", verifyAdmin, addClient);

router.put("/update-user/:userId", verifyAdmin, updateUser);
router.put("/update-freelancer/:userId", verifyAdmin, updateFreelancer);
router.put("/update-client/:userId", verifyAdmin, updateClient);

router.delete("/delete-user/:userId", verifyAdmin, deleteUser);
router.get("/get-user/:userId", verifyToken, verifyAdmin, getUserById);
router.get("/get-all-users", verifyAdmin, getAllUsers);

router.put("/update-userProfile", verifyToken, verifyFreelancer, updateUserProfile);
router.get("/get-freelancerByid/:freelancerId", verifyToken, getFreelancerById);
router.get("/get-all-freelancers", verifyToken, getAllFreelancers);
router.get("/get-all-clients", verifyToken, getAllClients);

router.get("/get-current-user", verifyToken, getCurrentUser);

router.get("/users-with-chat", verifyToken, getUsersWithChats);



export default router;