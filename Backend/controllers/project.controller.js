import Project from "../models/Project.model.js";
import Notification from "../models/Project.model.js";
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

        await Notification.create({
            userId: req.user._id,
            type: 'new_project',
            message: `Your project "${newProject.projectName}" was successfully created.`,
            projectId: newProject._id,
        });

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
        const projects = await Project.find({ clientId: req.user._id }).populate("freelancerId", "username profileImage");
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

// client confirms that a freelancer is assigned to a project
export const assignFreelancer = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { freelancerId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.freelancerId) {
            return res.status(400).json({ message: "This project already has a freelancer." });
        }

        project.freelancerId = freelancerId;
        project.status = "In Progress";

        await project.save();

        res.status(200).json({ message: "Deal confirmed", project });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Mark as completed
export const completeProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.status = "Completed";
        await project.save();

        const notifications = [
            {
                userId: project.clientId,
                type: "project_completed",
                message: `Your project "${project.projectName}" has been marked as completed.`,
                projectId: project._id,
            },
            {
                userId: project.freelancerId,
                type: "project_completed",
                message: `The project "${project.projectName}" you worked on has been marked as completed.`,
                projectId: project._id,
            }
        ];

        await Notification.insertMany(notifications);

        res.status(200).json({ message: "Project marked as completed", project });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};



// Get all projects assigned to the logged-in freelancer
export const getFreelancerProjects = async (req, res) => {
    try {
        const freelancerId = req.user._id;

        const projects = await Project.find({
            freelancerId,
            status: { $in: ["In Progress", "Completed"] }
        })
            .populate('clientId', 'username img')
            .sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (err) {
        console.error("Error in getFreelancerProjects:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// shared calendar
export const addTaskToCalendar = async (req, res) => {
    const { title, description, date } = req.body;
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Only client or freelancer can add tasks
    if (![project.clientId.toString(), project.freelancerId.toString()].includes(userId)) {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    const newTask = {
        title,
        description,
        date: new Date(date), // Ensure date is valid
        completed: false,
        createdBy: userId,
    };

    project.sharedCalendar.push(newTask);
    await project.save();

    // Create a notification for the other user (not the one who added the task)
    const notifyUserId = project.clientId.toString() === userId.toString() ? project.freelancerId : project.clientId;

    await Notification.create({
        userId: notifyUserId,
        type: "task_added",
        message: `A new task "${title}" has been added to the project "${project.projectName}".`,
        projectId: project._id,
    });

    res.status(201).json(project.sharedCalendar); // Return updated tasks
};


export const taskCompleted = async (req, res) => {
    const { projectId, taskId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const task = project.sharedCalendar.id(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (![project.clientId.toString(), project.freelancerId.toString()].includes(userId)) {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    task.completed = true;
    await project.save();

    const notifications = [
        {
            userId: project.clientId,
            type: "project_completed",
            message: `Your project "${project.projectName}" has been marked as completed.`,
            projectId: project._id,
        },
        {
            userId: project.freelancerId,
            type: "project_completed",
            message: `The project "${project.projectName}" you worked on has been marked as completed.`,
            projectId: project._id,
        }
    ];

    await Notification.insertMany(notifications);

    res.status(200).json(task);
};

export const fetchTasksForProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Log to verify projectId and project fetching
        console.log('Fetching project with ID:', projectId);

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Log the sharedCalendar content
        console.log('Project sharedCalendar:', project.sharedCalendar);

        // Only return the sharedCalendar tasks
        const tasks = project.sharedCalendar || [];

        // Log the tasks being returned
        console.log('Fetched tasks:', tasks);

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks for project:', error);
        return res.status(500).json({ msg: 'Server error while fetching tasks.' });
    }
};


export const deleteTaskFromCalendar = async (req, res) => {
    const { projectId, taskId } = req.params;

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: Missing user info' });
    }

    const userId = req.user._id;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Find the task in the sharedCalendar array
    const taskIndex = project.sharedCalendar.findIndex(task => task._id.toString() === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Get the task using the index
    const task = project.sharedCalendar[taskIndex];

    // Log the task for debugging purposes
    console.log('Task found:', task);

    // Check if `createdBy` exists on the task object
    if (!task.createdBy) {
        return res.status(400).json({ message: 'Task does not have a creator' });
    }

    // Check if the task was created by the current user
    if (task.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // Remove the task from the sharedCalendar array
    project.sharedCalendar.splice(taskIndex, 1); // This removes the task from the array

    // Save the project with the updated sharedCalendar
    await project.save();

    res.status(200).json({ msg: 'Task deleted successfully', tasks: project.sharedCalendar });
};


export const getAllFreelancerTasks = async (req, res) => {
    try {
        const freelancerId = req.user._id; // assuming JWT middleware adds this

        // 1. Find all projects assigned to the freelancer
        const projects = await Project.find({ freelancerId });

        // 2. Flatten tasks with project name
        const allTasks = projects.flatMap(project =>
            project.sharedCalendar.map(task => ({
                ...task._doc, // include all fields of the task
                projectId: project._id,
                projectTitle: project.projectName,
            }))
        );

        res.status(200).json(allTasks);
    } catch (error) {
        console.error('Error fetching tasks for freelancer:', error);
        res.status(500).json({ message: 'Server error' });
    }
};











