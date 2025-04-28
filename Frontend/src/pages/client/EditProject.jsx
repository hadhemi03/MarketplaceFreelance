import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button, TextField, Box, Typography, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert, Chip
} from '@mui/material';
import axios from 'axios';

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [skillsRequired, setSkillsRequired] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null); // Store the image file
    const [imagePreview, setImagePreview] = useState(''); // Store image preview URL
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/projects/get-project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            const project = res.data;
            setProjectName(project.projectName);
            setDescription(project.description);
            setSkillsRequired(project.skillsRequired);
            setPrice(project.price);
            setCategory(project.category);
            setImage(project.image || null); // Assuming your project has an `image` field
            setImagePreview(project.image || ''); // Show the old image if available
        };

        fetchProject();
    }, [projectId]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            if (!skillsRequired.includes(inputValue.trim())) {
                setSkillsRequired([...skillsRequired, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Preview the new image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('description', description);
        formData.append('skillsRequired', JSON.stringify(skillsRequired));
        formData.append('price', price);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(
                `http://localhost:5000/api/projects/update-project/${projectId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            setOpenSnackbar(true);
            setTimeout(() => navigate(`/client/my-projects`), 1500);
        } catch (err) {
            console.error('Error updating project', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h5" textAlign="center" gutterBottom>Edit Project</Typography>
            <form onSubmit={handleSubmit}>
                {/* Project Name */}
                <TextField
                    fullWidth
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Description */}
                <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Skills */}
                <TextField
                    fullWidth
                    label="Skills"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                    {skillsRequired.map((skill, index) => (
                        <Chip
                            key={index}
                            label={skill}
                            onDelete={() => setSkillsRequired(skillsRequired.filter(s => s !== skill))}
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))}
                </Box>

                {/* Price */}
                <TextField
                    fullWidth
                    label="Price (DT)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Category */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
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
                            src={imagePreview} // Using imagePreview to show the selected image
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

                {/* File Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <label htmlFor="image-upload">
                    <Button variant="outlined" component="span" fullWidth>
                        Choose Image
                    </Button>
                </label>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Update Project'}
                </Button>
            </form>

            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="success">Project updated successfully!</Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProject;
