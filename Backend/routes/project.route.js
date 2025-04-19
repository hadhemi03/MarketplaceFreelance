import express from "express";
import { verifyAdmin, verifyClient, verifyClientOrAdmin, verifyFreelancer, verifyToken } from "../utils/verifyToken.js";
import { assignFreelancer, completeProject, createProject, deleteProject, getAllProjects, getCategories, getClientProjects, getFreelancerProjects, getProjectById, updateProject, uploadProjectImage } from "../controllers/project.controller.js";

const router = express.Router();


//Clients Routes
router.post("/create-project", verifyToken, verifyClient, uploadProjectImage, createProject);   // verifyToken to verify that the user is authentificated
router.put("/update-project/:projectId", verifyToken, verifyClient, uploadProjectImage, updateProject);
router.delete("/delete-project/:projectId", verifyToken, verifyClientOrAdmin, deleteProject);
router.get("/myprojects", verifyToken, verifyClient, getClientProjects);

// All Users (Freelancers & Clients) can view projects
router.get("/view-projects", verifyToken, getAllProjects);

// Categories
router.get("/get-categories", verifyToken, getCategories);

router.get("/get-project/:projectId", verifyToken, getProjectById);



router.put('/assign-freelancer/:projectId', verifyToken, verifyClient, assignFreelancer);
router.put('/:projectId/complete', verifyToken, verifyFreelancer, completeProject);

router.get('/freelancer-projects', verifyToken, verifyFreelancer, getFreelancerProjects)

export default router;