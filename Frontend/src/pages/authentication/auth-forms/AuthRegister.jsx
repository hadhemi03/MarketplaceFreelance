import { useEffect, useState } from 'react';

// material-ui imports
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// third party imports
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axios from 'axios';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // To redirect

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track registration process
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    role: 'client',
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');

    // Check localStorage for stored user info and update state
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setPreview(storedUser.profileImage || ""); // Set profile image from stored data
    }
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setMessage(""); // Clear previous messages

    const data = new FormData();
    if (file) data.append("file", file);
    data.append("username", values.username);
    data.append("email", values.email);
    data.append("password", values.password);
    data.append("country", values.country);
    data.append("role", values.role);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data, {
        withCredentials: true,  // Include credentials (cookies, session)
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.user) {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        // Show success toast
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (err) {
      console.error("Registration failed:", err.response);
      toast.error(err.response?.data?.message || 'Registration failed, please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          country: '',
          role: 'client',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          country: Yup.string().max(255).required('Country is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Stack spacing={3}>
                  {/* Username */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="username-signup">Username*</InputLabel>
                    <OutlinedInput
                      id="username-signup"
                      type="text"
                      value={values.username}
                      name="username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      fullWidth
                      error={Boolean(touched.username && errors.username)}
                    />
                    {touched.username && errors.username && (
                      <FormHelperText error id="helper-text-username-signup">
                        {errors.username}
                      </FormHelperText>
                    )}
                  </Stack>

                  {/* Email */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-signup"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="email"
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-signup">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>

                  {/* Password */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-password-signup">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>

                  {/* Country */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="country-signup">Country*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.country && errors.country)}
                      id="country-signup"
                      type="text"
                      value={values.country}
                      name="country"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your country"
                    />
                    {touched.country && errors.country && (
                      <FormHelperText error id="helper-text-country-signup">
                        {errors.country}
                      </FormHelperText>
                    )}
                  </Stack>

                  {/* Role */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="role-signup">Role*</InputLabel>
                    <FormControl fullWidth error={Boolean(touched.role && errors.role)}>
                      <Select
                        value={values.role}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          handleRoleChange(e);
                        }}
                        name="role"
                        id="role-signup"
                        displayEmpty
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="freelancer">Freelancer</MenuItem>
                      </Select>
                      {touched.role && errors.role && (
                        <FormHelperText error>{errors.role}</FormHelperText>
                      )}
                    </FormControl>
                  </Stack>

                  {/* Profile Image */}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="profile-img-signup">Profile Picture</InputLabel>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'block', width: '100%' }}
                    />
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        padding: 2,
                        textAlign: 'center',
                        backgroundImage: preview ? `url(${preview})` : 'url("/path-to-default-image.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        marginTop: '10px',
                      }}
                    >
                      {!preview && <Typography variant="body2" color="text.secondary">Profile Image</Typography>}
                    </Box>
                  </Stack>

                  {/* Submit Button */}
                  {errors.submit && (
                    <Stack item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Stack>
                  )}

                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Create Account
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Toast Container to Display Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
