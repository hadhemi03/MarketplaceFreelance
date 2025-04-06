import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password, country, role } = req.body;
        const file = req.file;  // the uploaded file

        // If file is uploaded, store the image path
        let imgUrl = "";
        if (file) {
            imgUrl = `/uploads/${file.filename}`;  // Store the file path in the database
        }

        // Validate role (only allow client or freelancer)
        if (!["admin", "client", "freelancer"].includes(role)) {
            return res.status(400).json({ message: "Invalid role selected." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            country,
            role, // client or freelancer
            img: imgUrl,
        });

        // Save the new user and check for errors
        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.status(400).json({ message: "Validation failed." });
        }

        res.status(201).json({
            message: "User registered successfully!",
            user: {
              username: savedUser.username,
              email: savedUser.email,
              country: savedUser.country,
              role: savedUser.role,
              img: savedUser.img,
            },
          });
    } catch (error) {
        console.error(error);  // Log the detailed error
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the entered password with the hashed password stored in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // payload
            process.env.JWT_SECRETKEY

        );

        // Set the token in a cookie (HttpOnly for security)
        res.cookie("access_token", token, {
            httpOnly: true,  // Prevents client-side access to the cookie
            secure: process.env.NODE_ENV === "production",  // Only send cookies over HTTPS in production
            sameSite: "Strict",  // Prevent cross-site request forgery (CSRF)

        });

        // Send the response with the token and user data
        res.status(200).json({
            message: "Login successful",
            token, // Now the frontend can store it in localStorage
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                img: user.img,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the access_token cookie by setting it to an empty value and an expiration date in the past
        res.clearCookie("access_token", {
            httpOnly: true,  // Ensures the cookie cannot be accessed via JavaScript
            secure: process.env.NODE_ENV === "production",  // Only send cookies over HTTPS in production
            sameSite: "Strict",  // Prevent CSRF attacks
        });

        // Send a response confirming the user is logged out
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};