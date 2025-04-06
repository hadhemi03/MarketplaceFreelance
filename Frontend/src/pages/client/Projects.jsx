/*import { useEffect, useState } from "react";
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
      const res = await axios.get(`http://localhost:5000/api/comments/getCommentsByProject/${projectId}`, {
        withCredentials: true,
      });
      setComments((prev) => ({ ...prev, [projectId]: res.data.comments }));
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
                  Load comments
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

export default Projects;*/


import { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent, CardMedia, TextField, Button, Divider, Slider, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your category options
const categoryOptions = [
  "Graphics & Designs", "Digital Marketing", "Writing & Translation", "Video & Animation",
  "Music & Audio", "Programming & Tech", "Business", "Legal & Compliance", "Data", "Photography",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects/view-projects', { withCredentials: true });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch filtered projects based on the selected filters
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects/view-projects', {
          params: {
            search: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: selectedCategory || undefined,
            skill: selectedSkills || undefined,
          },
          withCredentials: true,
        });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Error filtering projects:", error);
      }
    };
    fetchFilteredProjects();
  }, [searchTerm, priceRange, selectedCategory, selectedSkills]);

  // Handle comment changes
  const handleCommentChange = (projectId, text) => {
    setNewComment(prev => ({ ...prev, [projectId]: text }));
  };

  // Submit new comment
  const handleCommentSubmit = async (projectId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/add-comment/${projectId}`,
        { text: newComment[projectId] },
        { withCredentials: true }
      );
      setComments(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data.comment],
      }));
      setNewComment(prev => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Fetch comments for each project
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

  // Create a custom MUI theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      background: {
        default: '#f4f6f8',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, display: 'flex', backgroundColor: 'background.default' }}>
        {/* Sidebar for Filters */}
        <Box sx={{
          width: 250,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: 'white',
          boxShadow: 2,
          borderRadius: 2,
          p: 2,
        }}>
          {/* Search by Project Name */}
          <Typography variant="h6" fontWeight="bold" color="primary.main">Search by Project Name</Typography>
          <TextField
            fullWidth
            label="Search by Project Name"
            variant="outlined"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by project name..."
            sx={{ mb: 2 }}
          />
          {/* Price Range Slider */}
          <Typography variant="h6" fontWeight="bold" color="primary.main">Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            sx={{ width: '100%', mb: 2 }}
          />
          {/* Category Filter */}
          <Typography variant="h6" fontWeight="bold" color="primary.main">Category</Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              displayEmpty
              notched
              sx={{ height: '56px' }}
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              {categoryOptions.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Project Feed */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">🧩 Project Feed</Typography>
          <Stack spacing={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {projects.map(project => (
              <Card key={project._id} sx={{
                p: 3,
                width: '100%',
                maxWidth: 800,
                mx: 'auto',
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
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
                  <Typography variant="h6" fontWeight="bold">{project.projectName}</Typography>
                  <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip label={`$${project.price}`} color="primary" />
                    <Button variant="contained" color="primary">Bid Now</Button>
                  </Box>
                </CardContent>
                {/* Comments Section */}
                <Divider sx={{ mt: 2, mb: 1 }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Add a comment"
                  value={newComment[project._id] || ""}
                  onChange={e => handleCommentChange(project._id, e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleCommentSubmit(project._id)}
                >
                  Submit Comment
                </Button>
                {comments[project._id] && comments[project._id].map(comment => (
                  <Box key={comment._id} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">{comment.text}</Typography>
                  </Box>
                ))}
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Projects;


