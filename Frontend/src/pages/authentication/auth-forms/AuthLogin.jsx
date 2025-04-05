import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';

// react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Utils for making requests
import newRequest from '../../../utils/newRequest.js';

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await newRequest.post(
        'http://localhost:5000/api/auth/login',
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );

      console.log("Login Response:", response.data);

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);  // ✅ Store token
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role);

      toast.success('Login successful!');

      // Navigate to the correct dashboard after a short delay
      setTimeout(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'client') {
          navigate('/client/projects');
        } else {
          navigate('/dashboard/default');
        }
      }, 300); // Short delay before redirect

    } catch (err) {
      console.log('Login failed:', err);
      toast.error(err.response?.data?.message || 'Login failed, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error>{errors.email}</FormHelperText>
                    )}
                  </Stack>

                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-login">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      placeholder="Enter password"
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error>{errors.password}</FormHelperText>
                    )}
                  </Stack>

                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Login
                    </Button>
                  </AnimateButton>

                  <Divider>
                    <Typography variant="caption">Login with</Typography>
                  </Divider>

                  <FirebaseSocial />
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
