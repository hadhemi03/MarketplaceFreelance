import { useState } from 'react';
import {
  Button, TextField, Box, Typography, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert, Chip
} from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState([]); // State for skills
  const [inputValue, setInputValue] = useState(''); // State for input value
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  // Handle adding skills
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault(); // Prevent form submission

      if (!skillsRequired.includes(inputValue.trim())) {
        setSkillsRequired((prevSkills) => [...prevSkills, inputValue.trim()]);
      }

      setInputValue(''); // Clear input field after adding
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Create FormData and append values
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('description', description);
    skillsRequired.forEach((skill, i) => {
      formData.append(`skillsRequired[${i}]`, skill);
    });
    formData.append('price', price);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const res = await axios.post('http://localhost:5000/api/projects/create-project', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
         // 'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setLoading(false);
      if (res.status === 201 || res.status === 200) {
        setSnackbarMessage('Project created successfully!');
        setOpenSnackbar(true);
        setError(''); // Clear any previous error
        setTimeout(() => {
          navigate('/client/my-projects');
        }, 100);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Error creating project:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Error creating project. Please try again.';
      setError(message);
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

        {/* Skills Input */}
        <TextField
          label="Skills Required"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          sx={{ marginBottom: '16px' }}
        />

        {/* Display skills as Chips */}
        <Box sx={{ marginBottom: '16px' }}>
          {skillsRequired.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => setSkillsRequired(skillsRequired.filter(s => s !== skill))}
              color="primary"
              sx={{ marginRight: '8px', marginBottom: '8px' }}
            />
          ))}
        </Box>

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

        {/* Image Preview */}
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
        autoHideDuration={3000}
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
