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


import { useEffect, useState } from "react";
import {
  Typography, Card, CardContent, CardMedia, Box, Stack, Chip,
  TextField, Button, Divider, Grid, Slider, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "axios";
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const categoryOptions = [
  "Graphics & Designs", "Digital Marketing", "Writing & Translation", "Video & Animation",
  "Music & Audio", "Programming & Tech", "Business", "Legal & Compliance", "Data", "Photography",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // General search term
  const [priceRange, setPriceRange] = useState([0, 10000]); // Price range filter state
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter state
  const [searchName, setSearchName] = useState(""); // Project name search state
  const [selectedSkills, setSelectedSkills] = useState(""); // Skills filter state
  
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

  useEffect(() => {
    const fetchFilteredProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects/view-projects", {
          params: {
            search: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: selectedCategory !== "" ? selectedCategory : undefined,
            skill: selectedSkills !== "" ? selectedSkills : undefined,
          },
          withCredentials: true,
        });
    
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error filtering projects:", error);
      }
    };

    fetchFilteredProjects();
  }, [searchTerm, priceRange, selectedCategory, selectedSkills]);

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
  
      setComments((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), ...res.data],
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', backgroundColor: '#f4f4f9' }}>
      {/* Left Sidebar - Filters */}
      <Box
        sx={{
          width: 250,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: 'white',
          boxShadow: 2,
          borderRadius: 2,
          p: 2,
        }}
      >
        {/* Search by Project Name */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">Search by Project Name</Typography>
          <TextField
            fullWidth
            label="Search by Project Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by project name..."
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Search by Skills */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">Search by Skills</Typography>
          <TextField
            fullWidth
            label="Search by Skills"
            variant="outlined"
            value={selectedSkills}
            onChange={(e) => setSelectedSkills(e.target.value)}
            placeholder="Search by skill..."
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Price Range Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">Price Range</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              type="number"
              label="Min"
              variant="outlined"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              sx={{ width: "160px", '& input': { textAlign: 'center', padding: '10px' }}}
            />
            <Slider
              value={priceRange}
              onChange={(event, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              sx={{ flexGrow: 1, mt: "8px" }}
            />
            <TextField
              type="number"
              label="Max"
              variant="outlined"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              sx={{ width: "160px", '& input': { textAlign: 'center', padding: '10px' }}}
            />
          </Box>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">Category</Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              notched
              sx={{ height: "56px" }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Right Side - Project Feed */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main" sx={{ fontFamily: 'Roboto' }}>
          🧩 Project Feed
        </Typography>

        <Stack spacing={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {projects.map((project) => (
            <Card key={project._id} sx={{ p: 3, width: "100%", maxWidth: 800, mx: "auto", boxShadow: 3, borderRadius: 3, transition: "transform 0.3s", '&:hover': { transform: 'scale(1.05)' } }}>
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

                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {project.skillsRequired?.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" color="primary" />
                  ))}
                </Box>

                <Typography variant="subtitle1" color="success.main" sx={{ mt: 2 }} fontWeight="bold">
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
                    sx={{ mb: 1, textTransform: "none", backgroundColor: "#1976d2", color: "white", '&:hover': { backgroundColor: "#115293" } }}
                  >
                    View comments
                  </Button>
                  <Stack spacing={1}>
                    {comments[project._id]?.map((comment) => (
                      <Box key={comment._id} sx={{ bgcolor: "#f5f5f5", p: 1.2, borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight="bold">{comment.userName}</Typography>
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
                    sx={{ mt: 1, backgroundColor: "#1976d2", '&:hover': { backgroundColor: "#115293" } }}
                  >
                    Post
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Projects;
