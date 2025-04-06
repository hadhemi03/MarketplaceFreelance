import { useEffect, useState } from "react";
import {
  Typography, Card, CardContent, CardMedia, Box, Stack, Chip,
  TextField, Button, Divider
} from "@mui/material";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects/view-projects", {
          withCredentials: true,
        });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCommentChange = (projectId, text) => {
    setNewComment((prev) => ({ ...prev, [projectId]: text }));
  };

  const handleCommentSubmit = async (projectId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/add-comment/${projectId}`,
        { text: newComment[projectId] },
        { withCredentials: true }
      );

      setComments((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data.comment],
      }));

      setNewComment((prev) => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const fetchComments = async (projectId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/getCommentsByProject/${projectId}`, { withCredentials: true });
      setComments(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), ...res.data],
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        🧩 Project Feed
      </Typography>

      <Stack spacing={4}>
        {projects.map((project) => (
          <Card key={project._id} sx={{ p: 2 }}>
            {project.image && (
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:5000${project.image}`}
                alt={project.projectName}
                sx={{ borderRadius: 2 }}
              />
            )}

            <CardContent>
              <Typography variant="h6">{project.projectName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {project.skillsRequired?.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" color="primary" />
                ))}
              </Box>

              <Typography variant="subtitle1" color="success.main" sx={{ mt: 2 }}>
                💰 {project.price} DT
              </Typography>

              <Divider sx={{ my: 2 }} />


              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Comments
                </Typography>
                <Button
                  size="small"
                  onClick={() => fetchComments(project._id)}
                  sx={{ mb: 1, textTransform: "none" }}
                >
                  View comments
                </Button>
                <Stack spacing={1}>
                  {comments[project._id]?.map((comment) => (
                    <Box key={comment._id} sx={{ bgcolor: "#f5f5f5", p: 1.2, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {comment.userName}
                      </Typography>
                      <Typography variant="body2">{comment.text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Write a comment..."
                  size="small"
                  value={newComment[project._id] || ""}
                  onChange={(e) => handleCommentChange(project._id, e.target.value)}
                />
                <Button
                  onClick={() => handleCommentSubmit(project._id)}
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Post
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Projects;