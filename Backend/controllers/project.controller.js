import Project from "../models/Project.model.js";
import { createError } from "../utils/error.js";
import User from "../models/User.model.js";
import multer from "multer";
import path from "path";
import fs from 'fs';             // node module that delete the old omage from the system
import { fileURLToPath } from 'url';

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

        // Ensure `skillsRequired` is always an array
        let parsedSkills = [];
        if (typeof skillsRequired === "string") {
            try {
                parsedSkills = JSON.parse(skillsRequired); // Convert JSON string to array
            } catch (error) {
                return res.status(400).json({ message: "Invalid skills format." });
            }
        } else if (Array.isArray(skillsRequired)) {
            parsedSkills = skillsRequired;
        } else {
            return res.status(400).json({ message: "Skills must be an array." });
        }

        console.log("Skills Required after parsing:", parsedSkills);


        // Image URL si l'utilisateur a uploadé une image
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newProject = new Project({
            projectName,
            description,
            skillsRequired: parsedSkills,
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Update an existing project (Client only)
// delete the old img from uploads and replace it with the new image 
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

        // Update fields
        if (projectName !== undefined) project.projectName = projectName;
        if (description !== undefined) project.description = description;

        // Ensure `skillsRequired` is always an array
        let parsedSkills = [];
        if (typeof skillsRequired === "string") {
            try {
                parsedSkills = JSON.parse(skillsRequired); // Convert JSON string to array
            } catch (error) {
                return res.status(400).json({ message: "Invalid skills format." });
            }
        } else if (Array.isArray(skillsRequired)) {
            parsedSkills = skillsRequired;
        } else {
            return res.status(400).json({ message: "Skills must be an array." });
        }

        project.skillsRequired = parsedSkills; // Update skillsRequired correctly

        if (price !== undefined) project.price = price;
        if (category !== undefined) project.category = category;

        // Handle image update
        if (req.file) {
            // Delete old image if exists
            if (project.image) {
                const oldImagePath = path.join(__dirname, '..', project.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Failed to delete old image:", err);
                    }
                });
            }

            // Set new image path
            project.image = `/uploads/${req.file.filename}`;
        }

        // Save the updated project
        await project.save();
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (err) {
        console.error("Error updating project:", err);
        next(createError(500, "Server Error, could not update project."));
    }
};


// Delete a project (Client only)
// delte the image too
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
        if (
            req.user.role !== 'admin' && 
            project.clientId.toString() !== req.user._id.toString()
          ) {
            console.log("Unauthorized user:", req.user._id);
            return next(createError(403, "You are not authorized to delete this project."));
        }

        // Delete image file from uploads folder
        if (project.image) {
            const imagePath = path.join(__dirname, '..', project.image); // project.image is like "/uploads/image.jpg"
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Failed to delete image file:", err);
                } else {
                    console.log("Image file deleted:", imagePath);
                }
            });
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
    const { search, minPrice, maxPrice, category, skill } = req.query;

    try {
        let query = {};

        let conditions = [];

        // Filtering by name or skills
        if (search) {
            conditions.push({
                projectName: { $regex: search, $options: "i" }
            });
        }
        
        if (skill) {
            conditions.push({
                skillsRequired: { $elemMatch: { $regex: skill, $options: "i" } }
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
            currency: 'DT',
            // Ensure skillsRequired is always an array, even if it was stored as a string
            skillsRequired: Array.isArray(project.skillsRequired)
                ? project.skillsRequired
                : JSON.parse(project.skillsRequired || '[]')
        }));

        res.status(200).json({ projects: projectsWithDT });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch projects."));
    }
};


// Get project by id (all users)
export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project);  // get project 
    } catch (err) {
        console.error("Error fetching project:", err);
        res.status(500).json({ message: "Server error while fetching project" });
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





