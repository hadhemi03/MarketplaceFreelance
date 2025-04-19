import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import DataTable from 'pages/dashboard/DataTable'; // assuming same DataTable component is used

const FreelancerMyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFreelancerProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects/freelancer-projects", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching freelancer projects", err);
      setError("Failed to fetch your projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerProjects();
  }, []);

  const columns = [
    { id: 'projectName', label: 'Project Name' },
    {
      id: 'client',
      label: 'Client',
      format: (value, row) =>
        row.clientId && row.clientId.username ? (
          <Typography>{row.clientId.username}</Typography>
        ) : (
          <Typography fontStyle="italic" color="text.secondary">
            Unknown
          </Typography>
        ),
    },
    {
      id: 'status',
      label: 'Status',
      format: (value) => (
        <Typography>
          {value}
        </Typography>
      ),
    },
    {
      id: 'price',
      label: 'Price',
      format: (value) => (
        <Typography>{value} DT</Typography>
      ),
    },
    {
      id: 'createdAt',
      label: 'Created At',
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom color="primary">
        📁 My Assigned Projects
      </Typography>

      {projects.length > 0 ? (
        <DataTable columns={columns} rows={projects} />
      ) : (
        <Typography>No assigned projects found.</Typography>
      )}
    </Box>
  );
};

export default FreelancerMyProjects;
