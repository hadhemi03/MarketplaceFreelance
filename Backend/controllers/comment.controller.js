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
      .populate("project", "name")  // Populating project with its name
      .populate("user", "username") // Populating user with its username
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// the admin and the user that added this comment 
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // From token

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the admin or the one who created the comment
    if (req.user.role !== "admin" && comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this comment" });
    }

    // Update the comment
    comment.text = text;
    await comment.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// the admin and the user that added this comment 
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // From token

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the admin or the one who created the comment
    if (req.user.role !== "admin" && comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Delete the comment
    await comment.remove();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("project", "projectName") // Populating the project name only
      .populate("user", "username") // Populating the user username
      .sort({ createdAt: -1 });

    // Log the populated comments
    console.log(comments);  // Check if the project is populated correctly

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching all comments:", err);
    res.status(500).json({ message: "Server error" });
  }
};





