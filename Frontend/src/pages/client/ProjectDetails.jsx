import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, Button, Grid } from '@mui/material';
import { NumericFormat } from 'react-number-format'; // If you need formatting

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/projects/get-project/${projectId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data);
      } catch (err) {
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!project) return <Typography>No project found.</Typography>;

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5' }}>
      <Paper sx={{ padding: 4, maxWidth: 1200, margin: 'auto', borderRadius: 2 }}>
        
        {/* Project Header and Image */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            {project.image && (
              <img 
                src={project.image ? `http://localhost:5000${project.image}` : ""}
                alt={project.projectName} 
                style={{ maxWidth: '100%', borderRadius: '10px' }} 
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {project.projectName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {project.category}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
              Price: <NumericFormat value={project.price} displayType="text" thousandSeparator suffix=" DT" />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Status: {project.status}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Created At: {new Date(project.createdAt).toLocaleDateString()}
            </Typography>

            {/* Added margin-top for spacing between project details */}
            <Typography variant="body1" sx={{ marginTop: 3 }}>
              {project.description}
            </Typography>
          </Grid>
        </Grid>  
      </Paper>
    </Box>
  );
};
export default ProjectDetails;
