import { useEffect, useState } from "react";
import {
  Grid, Typography, Card, CardContent, Avatar, Box, Stack, Chip,
  TextField, MenuItem, Button
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Search from "layout/Dashboard/Header/HeaderContent/Search";

const MakeDealPage = () => {
  const { projectId } = useParams();
  const [freelancers, setFreelancers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [sendingOffer, setSendingOffer] = useState(null);

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

  const handleSendOffer = async (freelancerId) => {
    try {
      setSendingOffer(freelancerId);
      await axios.post(`http://localhost:5000/api/offers/make-offer`, {
        projectId,
        freelancerId
      }, { withCredentials: true });

      alert("Offer sent successfully!");
    } catch (err) {
      console.error("Failed to send offer:", err);
      alert("Something went wrong while sending the offer.");
    } finally {
      setSendingOffer(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        🤝 Make a Deal – Choose a Freelancer
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
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

      <Grid container spacing={3}>
        {freelancers.map((freelancer) => {
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
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
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
                    <Typography variant="h6" fontWeight={600}>
                      {freelancer.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {freelancer.country}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle1" color="primary" fontWeight={500}>
                  {freelancer.occupation || "Freelancer"}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {freelancer.desc || "No description available."}
                </Typography>

                {freelancer.skills.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
                    {freelancer.skills.map((skill, i) => (
                      <Chip key={i} label={skill} color="primary" size="small" />
                    ))}
                  </Stack>
                )}

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => handleSendOffer(freelancer._id)}
                  disabled={sendingOffer === freelancer._id}
                >
                  {sendingOffer === freelancer._id ? "Sending..." : "Send Offer"}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MakeDealPage;
