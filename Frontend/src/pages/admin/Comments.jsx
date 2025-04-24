import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'pages/dashboard/DataTable'; // Assuming you have a similar DataTable component
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

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState({ content: '', projectId: '' });

  const token = localStorage.getItem("token");

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/comments/get-all-comments", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle adding a comment
  const handleAddComment = async () => {
    try {
      await axios.post("http://localhost:5000/api/comments/add-comment", newComment, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchComments();
      setAddDialogOpen(false);
      setNewComment({ content: '', projectId: '' });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle deleting a comment
  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/delete-comment/${commentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setComments(comments.filter(c => c._id !== commentToDelete));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const columns = [
    { id: 'text', label: 'Comment Content' },
    { id: 'projectName', label: 'Project Name' },
    { id: 'userName', label: 'User' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => handleDeleteClick(row._id)}>
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
          + Add Comment
        </Button>
      </Box>

      {comments.length > 0 ? (
        <DataTable
          columns={columns}
          rows={comments.map(comment => ({
            ...comment,
            projectName: comment.project ? comment.project.projectName : 'No project', // Adjust based on your data structure
          }))}
        />
      ) : (
        <Typography>No comments found.</Typography>
      )}

      {/* Add Comment Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Comment</DialogTitle>
        <DialogContent>
          <TextField
            label="Content"
            fullWidth
            margin="dense"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          />
          <TextField
            label="Project ID"
            fullWidth
            margin="dense"
            value={newComment.projectId}
            onChange={(e) => setNewComment({ ...newComment, projectId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddComment}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
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

export default AdminComments;
