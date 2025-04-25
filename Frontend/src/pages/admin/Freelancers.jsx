import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'pages/dashboard/DataTable';
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

const AdminFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFreelancer, setNewFreelancer] = useState({ username: '', email: '' });
  const [editingFreelancer, setEditingFreelancer] = useState(null);

  const token = localStorage.getItem("token");

  const fetchFreelancers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/get-all-freelancers", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFreelancers(res.data.freelancers || []);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to fetch freelancers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleAddFreelancer = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/add-freelancer", newFreelancer, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchFreelancers();
      setAddDialogOpen(false);
      setNewFreelancer({ username: '', email: '' });
    } catch (err) {
      console.error("Error adding freelancer:", err);
    }
  };

  const handleEditFreelancer = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/update-freelancer/${editingFreelancer._id}`, editingFreelancer, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchFreelancers();
      setEditDialogOpen(false);
      setEditingFreelancer(null);
    } catch (err) {
      console.error("Error editing freelancer:", err);
    }
  };

  const handleDeleteClick = (freelancerId) => {
    setFreelancerToDelete(freelancerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete-user/${freelancerToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFreelancers(freelancers.filter(f => f._id !== freelancerToDelete));
      setDeleteDialogOpen(false);
      setFreelancerToDelete(null);
    } catch (err) {
      console.error("Error deleting freelancer:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setFreelancerToDelete(null);
  };

  const columns = [
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => {
            setEditingFreelancer({ ...row });
            setEditDialogOpen(true);
          }}>
            Edit
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteClick(row._id)}>
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
          onClick={() => setAddDialogOpen(true)}
          sx={{
            backgroundColor: '#4caf50',
            color: '#fff',
            '&:hover': { backgroundColor: '#43a047' },
            fontSize: '1rem',
            padding: '8px 16px',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          + Add Freelancer
        </Button>
      </Box>

      {freelancers.length > 0 ? (
        <DataTable columns={columns} rows={freelancers} />
      ) : (
        <Typography>No freelancers found.</Typography>
      )}

      {/* Add Freelancer Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Freelancer</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={newFreelancer.username}
            onChange={(e) => setNewFreelancer({ ...newFreelancer, username: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newFreelancer.email}
            onChange={(e) => setNewFreelancer({ ...newFreelancer, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddFreelancer}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Freelancer Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Freelancer</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={editingFreelancer?.username || ''}
            onChange={(e) =>
              setEditingFreelancer({ ...editingFreelancer, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editingFreelancer?.email || ''}
            onChange={(e) =>
              setEditingFreelancer({ ...editingFreelancer, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditFreelancer}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this freelancer? This action cannot be undone.
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

export default AdminFreelancers;
