import { useEffect, useState } from "react";
import {
  Grid, Typography, Card, CardContent, Avatar, Box, Stack, Chip,
  TextField, MenuItem
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Add this import
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/get-all-freelancers", {
          params: {
            name: searchName,
            skill: searchSkill,
            country: searchCountry,
          },
          withCredentials: true,
        });
        setFreelancers(response.data.freelancers || []);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };

    fetchFreelancers();
  }, [searchName, searchSkill, searchCountry]);

  const handleFreelancerClick = (freelancerId) => {
    // Navigate to the chat page for the selected freelancer
    navigate(`/messages/${freelancerId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        🔍 Explore Freelancers
      </Typography>

      {/* Search Filters Row */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Search by Name */}
        <Grid item xs={12} md={4}>
          <Search
            fullWidth
            label="Search by Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by Name"
          />
        </Grid>

        {/* Search by Skills */}
        <Grid item xs={12} md={4}>
          <Search
            fullWidth
            label="Search by Skills"
            variant="outlined"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            placeholder="Search by Skills"
          />
        </Grid>

        {/* Search by Country */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Filter by Country"
            variant="outlined"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Tunisia">Tunisia</MenuItem>
            <MenuItem value="France">France</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Freelancer Cards */}
      <Grid container spacing={3}>
        {freelancers?.map((freelancer) => {
          // Image Handling
          const imageUrl = freelancer.img?.trim()
            ? `http://localhost:5000${freelancer.img}`
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={freelancer._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => handleFreelancerClick(freelancer._id)} // Add click handler
              >
                {/* Avatar + Name + Country */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={imageUrl}
                    alt={freelancer.username}
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      bgcolor: "primary.main",
                      fontSize: 24,
                      color: "white",
                    }}
                  >
                    {!imageUrl && freelancer.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                      {freelancer.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {freelancer.country}
                    </Typography>
                  </Box>
                </Box>

                {/* Occupation */}
                <Typography variant="subtitle1" color="primary" fontWeight={500} gutterBottom>
                  {freelancer.occupation || "Freelancer"}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {freelancer.desc || "No description available."}
                </Typography>

                {/* Skills */}
                {freelancer.skills.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                    {freelancer.skills.map((skill, index) => (
                      <Chip key={index} label={skill} color="primary" size="small" />
                    ))}
                  </Stack>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Freelancers;
