import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";
import userRoute from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
dotenv.config()

// Middlewares
app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend requests
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,  // Allow sending cookies (if needed)
  }));
  
  app.use(cookieParser());
  app.use(express.json());

mongoose.connect(process.env.DB)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Serve static files from 'uploads' folder
app.use("/uploads", express.static("uploads"));  // Allow access to the 'uploads' folder



  
  // Routes
  app.use("/api/auth", authRoute);
  app.use("/api/projects", projectRoute);
  app.use("/api/comments", commentRoute )
  app.use("/api/users", userRoute);
  
  // Start server
  app.listen(process.env.PORT, () => {
    console.log("Server running on http://localhost:" + process.env.PORT);
  });
