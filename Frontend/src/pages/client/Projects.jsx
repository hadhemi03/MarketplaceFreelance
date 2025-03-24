import { useEffect, useState } from "react";
import { 
  Grid, Typography, Card, CardContent, CardMedia, Box, Stack, Chip, 
  TextField, Slider 
} from "@mui/material";
import axios from "axios";
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]); // Default price range

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

  // Filter projects dynamically
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects/view-projects", {
          params: {
            search: searchTerm,
            price: priceRange[1], // Max price filter
          },
          withCredentials: true,
        });

        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error filtering projects:", error);
      }
    };

    fetchFilteredProjects();
  }, [searchTerm, priceRange]); // Re-fetch projects when search or price range changes

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Explore All Projects
      </Typography>

      {/* Search Filters Row */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Search by Name or Skills */}
        <Grid item xs={12} md={6}>
          <Search
            fullWidth
            label="Search by Project Name or Skills"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or skill..."
          />
        </Grid>

        {/* Price Range Filter */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Price Range: {priceRange[0]} DT - {priceRange[1]} DT
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Min Price Input */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Min"
                variant="outlined"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
            </Grid>

            {/* Slider */}
            <Grid item xs={4}>
              <Slider
                value={priceRange}
                onChange={(event, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Max Price Input */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Max"
                variant="outlined"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </Grid>
          </Grid>
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
                image={project.image || "/default-project.jpg"} // Use a default image if none is provided
                alt={project.projectName}
              />
              <CardContent>
                <Typography variant="h6">{project.projectName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                  {project.skillsRequired.map((skill, index) => (
                    <Chip key={index} label={skill} color="primary" size="small" />
                  ))}
                </Stack>
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