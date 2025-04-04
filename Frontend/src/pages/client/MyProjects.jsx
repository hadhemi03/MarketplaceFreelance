import { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import DataTable, { StatusIndicator } from 'pages/dashboard/DataTable';
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects/myprojects", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(Array.isArray(res.data.projects) ? res.data.projects : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProjectClick = () => {
    navigate('/client/create-project');
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/projects/delete-project/${projectToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProjects(projects.filter(p => p._id !== projectToDelete));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete the project.");
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const columns = [
    { id: 'projectName', label: 'Project Name' },
    { id: 'category', label: 'Category' },
    {
      id: 'status',
      label: 'Status',
      format: (value) => <StatusIndicator status={value} />,
    },
    {
      id: 'price',
      label: 'Price',
      align: 'right',
      format: (value) => (
        <NumericFormat value={value} displayType="text" thousandSeparator suffix="DT" />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created At',
      format: (value) => new Date(value).toLocaleDateString(),
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/client/projectDetails/${row._id}`)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteClick(row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ marginBottom: '20px' }}>
        <Button
          variant="contained"
          onClick={handleCreateProjectClick}
          sx={{
            backgroundColor: '#ea8ca4',
            color: '#fff',
            '&:hover': { backgroundColor: '#F287A6' },
            fontSize: '1rem',
            padding: '8px 16px',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>+ Add Project</span>
        </Button>
      </Box>

      {Array.isArray(projects) && projects.length > 0 ? (
        <DataTable columns={columns} rows={projects} />
      ) : (
        <Typography>No projects found.</Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProjects;
