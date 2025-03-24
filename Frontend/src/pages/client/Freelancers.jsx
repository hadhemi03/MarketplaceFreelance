import { useEffect, useState } from "react";
import {
  Grid, Typography, Card, CardContent, Avatar, Box, Stack, Chip,
  TextField, MenuItem
} from "@mui/material";
import axios from "axios";
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Explore Freelancers
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

        {/* Search by Country (Dropdown) */}
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
            {/* Add more countries as needed */}
          </TextField>
        </Grid>
      </Grid>

      {/* Freelancer Cards */}
      <Grid container spacing={3}>
        {freelancers?.map((freelancer) => {
          // Only show image if freelancer has a valid img URL
          const imageUrl = freelancer.img && freelancer.img.trim() !== "" 
            ? `${import.meta.env.VITE_PUBLIC_URL}${freelancer.img}` 
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={freelancer._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
                {/* Avatar + Name + Country */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={imageUrl} // If no image, will not display anything
                    alt={freelancer.username}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  >
                    {/* If no image, show initials */}
                    {!imageUrl && freelancer.username && freelancer.username[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{freelancer.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {freelancer.country}
                    </Typography>
                  </Box>
                </Box>

                {/* Occupation */}
                <Typography variant="body1" color="primary">
                  {freelancer.occupation}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {freelancer.desc}
                </Typography>

                {/* Skills */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                  {freelancer.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="primary" size="small" />
                  ))}
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Freelancers;
