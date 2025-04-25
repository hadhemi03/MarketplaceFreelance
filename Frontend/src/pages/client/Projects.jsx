import { useEffect, useState } from "react";
import {
  Typography, Card, CardContent, CardMedia, Box, Stack, Chip,
  TextField, Button, Divider, Slider, FormControl, Select, MenuItem
} from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';


const categoryOptions = [
  "Graphics & Designs", "Digital Marketing", "Writing & Translation", "Video & Animation",
  "Music & Audio", "Programming & Tech", "Business", "Legal & Compliance", "Data", "Photography",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const chipColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

  const [showComments, setShowComments] = useState({});
  const toggleComments = (id) => {
    setShowComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/get-current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        
        setCurrentUser(res.data); // e.g., { _id: '...', name: '...' }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

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
            search: searchName,
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
  }, [searchName, priceRange, selectedCategory, selectedSkills]);

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
        [projectId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDeleteComment = async (commentId, projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/comments/delete-comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setComments((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter(comment => comment._id !== commentId)
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  return (
    <Box sx={{ p: 3, display: 'flex', backgroundColor: '#f0f2f5' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 250,
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f4f9 100%)',
          boxShadow: 3,
          borderRadius: 3,
          p: 2,
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">Search by Project Name</Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search by name"
          sx={{ mb: 3, mt: 1, bgcolor: "#fff", borderRadius: 1 }}
        />

        <Typography variant="h6" fontWeight="bold" color="primary">Search by Skills</Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={selectedSkills}
          onChange={(e) => setSelectedSkills(e.target.value)}
          placeholder="e.g. React, Python"
          sx={{ mb: 3, mt: 1, bgcolor: "#fff", borderRadius: 1 }}
        />

        <Typography variant="h6" fontWeight="bold" color="primary">Price Range</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <TextField
            type="number"
            label="Min"
            variant="outlined"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            sx={{ width: "45%", bgcolor: "#fff", borderRadius: 1 }}
          />
          <TextField
            type="number"
            label="Max"
            variant="outlined"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            sx={{ width: "45%", bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>
        <Slider
          value={priceRange}
          onChange={(event, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" fontWeight="bold" color="primary">Category</Typography>
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Right Content */}
      <Box sx={{ flex: 1, ml: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 4 }}>
          🧩 Project Feed
        </Typography>

        <Stack spacing={4}>
          {projects.map((project) => (
            <Card
              key={project._id}
              sx={{
                p: 3,
                boxShadow: 4,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                transition: "all 0.3s ease-in-out",
                '&:hover': { boxShadow: 6, backgroundColor: "#f9f9f9" }
              }}
            >

              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{project.projectName}</Typography>
                <Typography variant="body2" color="text.secondary">{project.description}</Typography>

                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {project.skillsRequired?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color={chipColors[index % chipColors.length]}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle1" color="success.main" fontWeight="bold" sx={{ mt: 2 }}>
                  💰 {project.price} DT
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Comments ({comments[project._id]?.length || 0})
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => fetchComments(project._id)}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      backgroundColor: "#1976d2",
                      color: "white",
                      '&:hover': { backgroundColor: "#1565c0" }
                    }}
                  >
                    View comments
                  </Button>

                  <Stack spacing={1} mt={1}>
                    {comments[project._id]?.map((comment) => (
                      <Stack key={comment._id} direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}>
                        {comment.userName?.charAt(0).toUpperCase()}
                      </Box>
                    
                      <Box sx={{
                        bgcolor: "#f5f5f5",
                        p: 2,
                        borderRadius: 2,
                        flexGrow: 1,
                        position: "relative",
                      }}>
                        <Typography variant="subtitle2" fontWeight="bold">{comment.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.text}
                        </Typography>
                    
                        {currentUser?._id === comment.userId && (
                          <DeleteIcon
                            onClick={() => handleDeleteComment(comment._id, project._id)}
                            sx={{
                              color: 'error.main',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: 8,
                              right: 8,
                            }}
                          />
                        )}
                      </Box>
                    </Stack>
                    
                    ))}



                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                  <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    size="small"
                    variant="outlined"
                    value={newComment[project._id] || ""}
                    onChange={(e) => handleCommentChange(project._id, e.target.value)}
                    sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentSubmit(project._id)}
                    sx={{ backgroundColor: "#4caf50", '&:hover': { backgroundColor: "#388e3c" } }}
                  >
                    💬 Post
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Projects;
