import User from "../models/User.model.js";
import Message from "../models/message.model.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Create a new user (Admin only)
export const createUser = async (req, res, next) => {
    const { username, email, password, country, role } = req.body;

    if (!username || !email || !password || !country || !role) {
        return next(createError(400, "All fields are required."));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, "User already exists with this email."));
        }

        const newUser = new User({
            username,
            email,
            password,
            country,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        next(createError(500, "Server Error, could not create user."));
    }
};

export const addFreelancer = async (req, res, next) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return next(createError(400, "All fields are required."));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, "User already exists with this email."));
        }

        const newUser = new User({
            username,
            email,
            password: 'default123',
            country: 'unknown',
            role: 'freelancer',
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        next(createError(500, "Server Error, could not create user."));
    }
};

export const addClient = async (req, res, next) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return next(createError(400, "All fields are required."));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, "User already exists with this email."));
        }

        const newUser = new User({
            username,
            email,
            password: 'default123',
            country: 'unknown',
            role: "client",
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        next(createError(500, "Server Error, could not create user."));
    }
};


// Update user details (Admin only)
export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const {
        username,
        email,
        country,
        role,
        desc,
        occupation,
        skills,
        certificates,
        experiences,
        languages
    } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(createError(404, "User not found."));
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.country = country || user.country;
        user.role = role || user.role;
        user.desc = desc || user.desc;
        user.occupation = occupation || user.occupation;
        user.skills = skills || user.skills;
        user.certificates = certificates || user.certificates;
        user.experiences = experiences || user.experiences;
        user.languages = languages || user.languages;

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        next(createError(500, "Server Error, could not update user."));
    }
};

export const updateFreelancer = async (req, res, next) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'freelancer') {
            return next(createError(404, "Freelancer not found."));
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: "Freelancer updated successfully", user });
    } catch (err) {
        next(createError(500, "Server Error, could not update freelancer."));
    }
};

export const updateClient = async (req, res, next) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'client') {
            return next(createError(404, "Client not found."));
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: "Client updated successfully", user });
    } catch (err) {
        next(createError(500, "Server Error, could not update client."));
    }
};



// Delete a user (Admin only)
export const deleteUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(createError(404, "User not found."));
        }

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        next(createError(500, "Server Error, could not delete user."));
    }
};

// Get a user by ID (Admin only)
export const getUserById = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select("-password"); // Exclude password
        if (!user) {
            return next(createError(404, "User not found."));
        }

        res.status(200).json({ user });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch user."));
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.status(200).json({ users });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch users."));
    }
};

export const getAllClients = async (req, res, next) => {
    const { name, country } = req.query;
    const query = { role: "client" };

    if (name) {
        query.username = { $regex: name, $options: "i" };
    }
    if (country) {
        query.country = { $regex: country, $options: "i" };
    }

    try {
        const clients = await User.find(query).select("-password");
        res.status(200).json({ clients });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch clients."));
    }
};


// Update user profile (he is the only one that can update his profile)
export const updateUserProfile = async (req, res) => {
    const userId = req.user._id;
    const updateData = req.body;
  
    // Remove any fields that are not present in the updateData (e.g., empty fields)
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === '' || updateData[key] === undefined) {
        delete updateData[key];
      }
    });
  
    try {
      // Find the user by ID and update only the fields that are provided
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation still runs
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  };
  





// Récupérer un freelancer par son ID
export const getFreelancerById = async (req, res, next) => {
    const { freelancerId } = req.params;

    try {
        const freelancer = await User.findById(freelancerId).select("-password");
        if (!freelancer || freelancer.role !== "freelancer") {
            return next(createError(404, "Freelancer not found."));
        }

        res.status(200).json({ freelancer });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch freelancer."));
    }
};

// Récupérer tous les freelancers ou filtrer par nom/skills
export const getAllFreelancers = async (req, res, next) => {
    const { name, skill, country } = req.query;
    let query = { role: "freelancer" };

    if (name) {
        query.username = { $regex: name, $options: "i" }; // Recherche insensible à la casse
    }
    if (skill) {
        query.skills = { $in: [skill] }; // Vérifie si la compétence est dans le tableau des skills
    }
    if (country) {
        query.country = { $regex: country, $options: "i" }; // Search by country (case insensitive)
    }





    try {
        const freelancers = await User.find(query).select("-password");
        res.status(200).json({ freelancers });
    } catch (err) {
        next(createError(500, "Server Error, could not fetch freelancers."));
    }
};



export const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        // Check if decoded.userId exists and is valid
        if (!decoded.userId) {
            return res.status(400).json({ message: "Invalid token structure" });
        }

        // Find the user by ID
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error during getCurrentUser:", error);  // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }

};


// Controller to get users the current user has chatted with
export const getUsersWithChats = async (req, res) => {
    try {
        const currentUserId = req.user._id;  // The current user's ID from the JWT token

        // Find all messages where the current user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId },
                { receiverId: currentUserId }
            ]
        });

        // Extract unique user IDs (excluding the current user)
        const userIds = [
            ...new Set(
                messages.map(msg =>
                    msg.senderId.toString() === currentUserId.toString() ? msg.receiverId : msg.senderId
                )
            )
        ];

        // Populate user details (use User model to get user data)
        const users = await User.find({ _id: { $in: userIds } });

        res.status(200).json(users);  // Send back the list of users with whom the current user has chatted
    } catch (err) {
        console.error("Error fetching users with chats:", err);
        res.status(500).json({ message: "Error fetching users with chats" });
    }
};