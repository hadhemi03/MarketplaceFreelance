import { useState } from 'react';
import { Button, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('description', description);
    formData.append('skillsRequired', skillsRequired);
    formData.append('price', price);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const res = await axios.post('http://localhost:5000/api/projects/create-project', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // This ensures credentials (like cookies) are sent with the request
      });

      setLoading(false);
      if (res.status === 201) {
        // Show success message in Snackbar
        setSnackbarMessage('Project created successfully!');
        setOpenSnackbar(true);

        // Navigate to "My Projects" page after a short delay
        setTimeout(() => {
          navigate('/client/my-projects');
        }, 2000); // Delay the navigation to ensure the success message is visible
      }
    } catch (err) {
      setError('Error creating project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: 600, margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: '20px', textAlign: 'center' }}>
        Add Project
      </Typography>

      {error && <Typography color="error" sx={{ marginBottom: '20px', textAlign: 'center' }}>{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />

        <TextField
          label="Skills Required"
          variant="outlined"
          fullWidth
          required
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />

        <TextField
          label="Price (in DT)"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />

        <FormControl fullWidth sx={{ marginBottom: '16px' }} required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Graphics & Designs">Graphics & Designs</MenuItem>
            <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
            <MenuItem value="Writing & Translation">Writing & Translation</MenuItem>
            <MenuItem value="Video & Animation">Video & Animation</MenuItem>
            <MenuItem value="Music & Audio">Music & Audio</MenuItem>
            <MenuItem value="Programming & Tech">Programming & Tech</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Legal & Compliance">Legal & Compliance</MenuItem>
            <MenuItem value="Data">Data</MenuItem>
            <MenuItem value="Photography">Photography</MenuItem>
          </Select>
        </FormControl>

        {/* Image Upload Section */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ marginBottom: '16px' }}
        >
          Upload Project Image
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {/* Image Preview or Placeholder */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px dashed #ccc',
            padding: '10px',
            borderRadius: '8px',
            width: '100%',
            height: '200px',
            backgroundColor: '#f9f9f9',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Project"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ) : (
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              No image selected. Please upload an image.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={loading}
            sx={{ padding: '10px 20px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Project'}
          </Button>
        </Box>
      </form>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar will disappear after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProject;
