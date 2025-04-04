import { useEffect, useState } from "react";
import {
  Grid, Typography, Card, CardContent, CardMedia, Box, Stack, Chip,
  TextField, Slider, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import axios from "axios";
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const categoryOptions = [
  "Graphics & Designs",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "Programming & Tech",
  "Business",
  "Legal & Compliance",
  "Data",
  "Photography",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]); // Default price range
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects/view-projects",
          { withCredentials: true }
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch projects when filters change
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects/view-projects", {
          params: {
            search: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1], // Max price filter
            category: selectedCategory !== "" ? selectedCategory : undefined, // Ignore filter if empty
          },
          withCredentials: true,
        });

        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error filtering projects:", error);
      }
    };

    fetchFilteredProjects();
  }, [searchTerm, priceRange, selectedCategory]); // Re-fetch when filters change

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        🔍 Explore Projects
      </Typography>

      {/* Search Filters Row */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Search by Name or Skills */}
        <Grid item xs={12} md={4}>
          <Search
            fullWidth
            label="Search by Project Name or Skills"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or skill..."
            sx={{ height: "56px" }} // Ensure consistent height
          />
        </Grid>

        {/* Price Range Filter */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              type="number"
              label="Min"
              variant="outlined"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              sx={{
                width: "120px", // Increased width
                '& input': { textAlign: 'center', padding: '10px' } // Ensures proper spacing
              }} />
            <Slider
              value={priceRange}
              onChange={(event, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              sx={{ flexGrow: 1, mt: "8px" }} // Align with text fields
            />
            <TextField
              type="number"
              label="Max"
              variant="outlined"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              sx={{
                width: "120px", // Increased width
                '& input': { textAlign: 'center', padding: '10px' } // Ensures proper spacing
              }} />
          </Box>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ height: "56px" }} variant="outlined">
            <InputLabel shrink>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              notched
              sx={{ height: "56px", display: "flex", alignItems: "center" }} // Ensure height consistency
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
        </Grid>
      </Grid>


      {/* Project Cards */}
      <Grid container spacing={3}>
        {projects?.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="150"
                image={project.image ? `http://localhost:5000${project.image}` : ""}
                alt={project.projectName}
              />

              <CardContent>
                <Typography variant="h6">{project.projectName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description}
                </Typography>

                <Box sx={{ mt: 1, mb: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {(() => {
                    const skills = (() => {
                      if (Array.isArray(project.skillsRequired)) return project.skillsRequired;
                      try {
                        const parsed = JSON.parse(project.skillsRequired);
                        if (Array.isArray(parsed)) return parsed;
                        if (typeof parsed === 'string') return parsed.split(',').map(s => s.trim());
                        return [];
                      } catch {
                        return typeof project.skillsRequired === 'string'
                          ? project.skillsRequired.split(',').map(s => s.trim())
                          : [];
                      }
                    })();

                    return skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" color="primary" />
                    ));
                  })()}
                </Box>

                <Typography variant="h6" color="success.main">
                  {project.price} DT
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
