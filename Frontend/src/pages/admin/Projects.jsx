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

const AdminTemplate = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ projectName: '', description: '', price: '', skillsRequired: '', category: '' });
  const [editingItem, setEditingItem] = useState(null);

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects/view-projects", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setItems(res.data.projects || []);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    try {
      const payload = {
        ...newItem,
        price: Number(newItem.price),
        skillsRequired: newItem.skillsRequired.split(',').map(skill => skill.trim()),
      };
  
      await axios.post("http://localhost:5000/api/projects/create-project", payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      fetchItems();
      setAddDialogOpen(false);
      setNewItem({ projectName: '', description: '', price: '', skillsRequired: '', category: '' });
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);
    }
  };
  

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/projects/update-project/${editingItem._id}`, editingItem, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchItems();
      setEditDialogOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error editing item:", err);
    }
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/delete-project/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setItems(items.filter(i => i._id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    { id: 'projectName', label: 'Title' },
    { id: 'price', label: 'Price' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setEditingItem({ ...row });
              setEditDialogOpen(true);
            }}
          >
            Edit
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
          + Add Project
        </Button>
      </Box>

      {items.length > 0 ? (
        <DataTable columns={columns} rows={items} />
      ) : (
        <Typography>No items found.</Typography>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            margin="dense"
            value={newItem.projectName}
            onChange={(e) => setNewItem({ ...newItem, projectName: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <TextField
            label="Skills Required (comma-separated)"
            fullWidth
            margin="dense"
            value={newItem.skillsRequired}
            onChange={(e) => setNewItem({ ...newItem, skillsRequired: e.target.value })}
          />

          <TextField
            label="Category"
            fullWidth
            margin="dense"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            margin="dense"
            value={editingItem?.projectName || ''}
            onChange={(e) =>
              setEditingItem({ ...editingItem, projectName: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={editingItem?.description || ''}
            onChange={(e) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            value={editingItem?.price || ''}
            onChange={(e) =>
              setEditingItem({ ...editingItem, price: e.target.value })
            }
          />
          <TextField
            label="Category"
            fullWidth
            margin="dense"
            value={editingItem?.category || ''}
            onChange={(e) =>
              setEditingItem({ ...editingItem, category: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
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

export default AdminTemplate;
