import { useEffect, useState } from 'react';
import axios from 'axios';

import { NumericFormat } from 'react-number-format';
import DataTable, { StatusIndicator } from 'pages/dashboard/DataTable'; // Default import for DataTable and named import for StatusIndicator
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);  // Always start as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreateProjectClick = () => {
    navigate('/client/create-project');  // Navigate to the CreateProject page
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        console.log("Sending request with token:", token); // Debugging

        const res = await axios.get("http://localhost:5000/api/projects/myprojects", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response Data:", res.data); // Debugging
        // Log the projects data to verify the structure
        console.log("Projects with status:", res.data.projects.map(project => project.status));
        setProjects(Array.isArray(res.data.projects) ? res.data.projects : []); // Correct placement of this line
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const columns = [
    { id: 'projectName', label: 'Project Name' },
    { id: 'category', label: 'Category' },
    { id: 'status', label: 'Status', format: (value) => <StatusIndicator status={value} /> },
    { id: 'price', label: 'Budget', align: 'right', format: (value) => <NumericFormat value={value} displayType="text" thousandSeparator suffix="DT" /> },
    { id: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
  ];

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  console.log('Projects:', projects);  // Debugging

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Create Project Button */}
      <Box sx={{ marginBottom: '20px' }}>
        <Button
          variant="contained"
          onClick={handleCreateProjectClick}
          sx={{
            backgroundColor: '#ea8ca4', // Soft pink color
            color: '#fff', // White text
            '&:hover': {
              backgroundColor: '#F287A6', // Slightly darker pink on hover
            },
            fontSize: '1rem',
            padding: '8px 16px',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center', // Align the text and icon horizontally
            gap: '8px', // Space between icon and text
          }}
        >
          <span>+ Add Project</span> {/* Button Text */}
        </Button>
      </Box>

      {/* Render the Data Table if there are projects */}
      {Array.isArray(projects) && projects.length > 0 ? (
        <DataTable columns={columns} rows={projects} />
      ) : (
        <Typography>No projects found.</Typography>
      )}
    </Box>
  );
};

export default MyProjects;
