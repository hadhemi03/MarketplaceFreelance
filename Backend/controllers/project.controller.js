import Project from "../models/Project.model.js";
import { createError } from "../utils/error.js";
import User from "../models/User.model.js";

// Create a new project (Client only)
export const createProject = async (req, res, next) => {
    console.log("User from JWT:", req.user); // Log user object from JWT
    const { projectName, description, skillsRequired, price, category } = req.body;

    if (!projectName || !description || !skillsRequired || !price || !category) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        console.log("Creating project for client ID:", req.user._id);
        const client = await User.findById(req.user._id);
        console.log("Fetched client:", client);

        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        const newProject = new Project({
            projectName,
            description,
            skillsRequired,
            price,
            category,
            clientId: req.user._id,
            clientName: client.username
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (err) {
        console.error("Error:", err);  // Log the actual error
        next(createError(500, "Server Error, could not create project."));
    }
};


// Update an existing project (Client only)
export const updateProject = async (req, res, next) => {
    const { projectId } = req.params;
    const { projectName, description, skillsRequired, price, category } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return next(createError(404, "Project not found."));
        }

        // Ensure only the client who created the project can update it
        if (project.clientId.toString() !== req.user._id.toString()) {
            return next(createError(403, "You are not authorized to update this project."));
        }

        project.projectName = projectName || project.projectName;
        project.description = description || project.description;
        project.skillsRequired = skillsRequired || project.skillsRequired;
        project.price = price || project.price;
        project.category = category || project.category;

        await project.save();
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (err) {
        next(createError(500, "Server Error, could not update project."));
    }
};

// Delete a project (Client only)
export const deleteProject = async (req, res, next) => {
    console.log("DELETE request received for:", req.params.projectId);
    console.log("User making the request:", req.user);

    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        console.log("Fetched project:", project);

        if (!project) {
            console.log("Project not found");
            return next(createError(404, "Project not found."));
        }

        // Ensure only the client who created the project can delete it
        console.log("Checking ownership: project.clientId =", project.clientId, "req.user._id =", req.user._id);
        if (project.clientId.toString() !== req.user._id.toString()) {
            console.log("Unauthorized user:", req.user._id);
            return next(createError(403, "You are not authorized to delete this project."));
        }

        console.log("Deleting project...");
        await project.deleteOne();
        console.log("Project deleted successfully");
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error("Error deleting project:", err);
        next(createError(500, "Server Error, could not delete project."));
    }
};



// Get all projects (Freelancers and Clients )
export const getAllProjects = async (req, res, next) => {
    const { search, skills, price, category } = req.query;

    try {
        // Build query based on search, skills, and price filters
        let query = {};

        if (search) {
            query.projectName = { $regex: search, $options: "i" };
        }
        if (skills) {
            query.skillsRequired = { $in: skills.split(",") };
        }
        if (price) {
            query.price = { $lte: Number(price) }; // Filter by price 
        }
        if (category) {
            query.category = category;
        }

        const projects = await Project.find(query);
        res.status(200).json({ projects });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch projects."));
    }
};


// Get projects by client (Client only can see their own projects)
export const getClientProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ clientId: req.user._id });
        res.status(200).json({ projects });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch client projects."));
    }
};

// Get Categories
export const getCategories = async (req, res, next) => {
    try {
        const categories = Project.schema.path("category").enumValues; // Récupère les valeurs `enum`
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des catégories." });
    }
};



