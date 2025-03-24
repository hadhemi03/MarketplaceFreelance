import express from "express";
import { verifyClient, verifyToken } from "../utils/verifyToken.js";
import { createProject, deleteProject, getAllProjects, getCategories, getClientProjects, updateProject, uploadProjectImage } from "../controllers/project.controller.js";

const router = express.Router();


//Clients Routes
router.post("/create-project", verifyToken, verifyClient, uploadProjectImage, createProject);   // verifyToken to verify that the user is authentificated
router.put("/update-project/:projectId", verifyToken, verifyClient, updateProject);
router.delete("/delete-project/:projectId", verifyToken, verifyClient, deleteProject);
router.get("/myprojects", verifyToken, verifyClient, getClientProjects);

// All Users (Freelancers & Clients) can view projects
router.get("/view-projects", verifyToken, getAllProjects);

// Categories
router.get("/get-categories", verifyToken, getCategories);

export default router;