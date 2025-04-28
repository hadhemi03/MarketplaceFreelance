import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Chip, Divider, Button, Stack } from "@mui/material";



const VisitorProjects = () => {
  const [projects, setProjects] = useState([]);
  const { search } = useLocation(); // <-- this gets "?category=...." part
  const queryParams = new URLSearchParams(search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/category?category=${encodeURIComponent(category)}`);
        setProjects(res.data.projects);
      } catch (err) {
        console.log(err);
      }
    };

    if (category) {
      fetchProjects();
    }
  }, [category]);

  return (
    <Box sx={{ p: 3, display: 'flex', backgroundColor: '#f0f2f5' }}>
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
                      color="primary"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle1" color="success.main" fontWeight="bold" sx={{ mt: 2 }}>
                  💰 {project.price} DT
                </Typography>

                <Divider sx={{ my: 2 }} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default VisitorProjects;
