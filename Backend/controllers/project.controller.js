import Project from "../models/Project.model.js";
import { createError } from "../utils/error.js";
import User from "../models/User.model.js";
import multer from "multer";
import path from "path";

// Configuration de stockage pour les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dossier où stocker les images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renommer l'image avec un timestamp
    },
});

const upload = multer({ storage: storage });


// Create a new project (Client only)
export const createProject = async (req, res, next) => {
    try {
        console.log("User from JWT:", req.user);
        const { projectName, description, skillsRequired, price, category } = req.body;

        if (!projectName || !description || !skillsRequired || !price || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        console.log("Creating project for client ID:", req.user._id);
        const client = await User.findById(req.user._id);
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        // Image URL si l'utilisateur a uploadé une image
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newProject = new Project({
            projectName,
            description,
            skillsRequired,
            price,
            category,
            clientId: req.user._id,
            clientName: client.username,
            image: imageUrl, // Ajouter l'image
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (err) {
        console.error("Error:", err);
        next(createError(500, "Server Error, could not create project."));
    }
};

// Middleware pour gérer l'upload
export const uploadProjectImage = upload.single("image");


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
    const { search, minPrice, maxPrice, category } = req.query;

    try {
        let query = {};

        let conditions = [];

        // Filtering by name or skills
        if (search) {
            conditions.push({
                $or: [
                    { projectName: { $regex: search, $options: "i" } }, // Case-insensitive search
                    { skillsRequired: { $in: [new RegExp(search, "i")] } } // Case-insensitive skills search
                ]
            });
        }

        // Filtering by price range
        let priceFilter = {};
        if (minPrice) {
            priceFilter.$gte = Number(minPrice);
        }
        if (maxPrice) {
            priceFilter.$lte = Number(maxPrice);
        }
        if (Object.keys(priceFilter).length > 0) {
            conditions.push({ price: priceFilter });
        }

        // Filtering by category
        if (category) {
            conditions.push({ category });
        }

        // If we have multiple filters, use `$and`
        if (conditions.length > 0) {
            query.$and = conditions;
        }

        const projects = await Project.find(query);

        // Return projects with price in DT (Tunisian Dinar)
        const projectsWithDT = projects.map(project => ({
            ...project.toObject(),
            price: project.price, 
            currency: 'DT'
        }));

        res.status(200).json({ projects: projectsWithDT });
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



