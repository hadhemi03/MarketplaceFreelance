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

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ username: '', email: '' });
  const [editingClient, setEditingClient] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all clients from the backend
  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/get-all-clients", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setClients(res.data.clients || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Add new client
  const handleAddClient = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/add-client", newClient, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchClients();
      setAddDialogOpen(false);
      setNewClient({ username: '', email: '' });
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  // Edit an existing client
  const handleEditClient = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/update-client/${editingClient._id}`, editingClient, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchClients();
      setEditDialogOpen(false);
      setEditingClient(null);
    } catch (err) {
      console.error("Error editing client:", err);
    }
  };

  // Delete client
  const handleDeleteClick = (clientId) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete-user/${clientToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setClients(clients.filter(c => c._id !== clientToDelete));
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
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
            setEditingClient({ ...row });
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
          + Add Client
        </Button>
      </Box>

      {clients.length > 0 ? (
        <DataTable columns={columns} rows={clients} />
      ) : (
        <Typography>No clients found.</Typography>
      )}

      {/* Add Client Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={newClient.username}
            onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddClient}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={editingClient?.username || ''}
            onChange={(e) =>
              setEditingClient({ ...editingClient, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editingClient?.email || ''}
            onChange={(e) =>
              setEditingClient({ ...editingClient, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditClient}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this client? This action cannot be undone.
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

export default AdminClients;
