import Comment from "../models/Comment.model.js";
import Project from "../models/Project.model.js";
import User from "../models/User.model.js";

export const addComment = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { text } = req.body;
      const userId = req.user._id; // From token
      const user = await User.findById(userId);
  
      if (!text || !user) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }
  
      const comment = new Comment({
        project: projectId,
        user: userId,
        userName: user.username, 
        text,
      });
  
      await comment.save();
  
      res.status(201).json({ message: "Comment added successfully", comment });
    } catch (err) {
      console.error("Error adding comment:", err);
      res.status(500).json({ message: "Server error" });
    }
};

export const getCommentsByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const comments = await Comment.find({ project: projectId })
        .sort({ createdAt: -1 }); // Newest first
  
      res.status(200).json(comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  