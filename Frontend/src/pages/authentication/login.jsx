import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={15}>
            <Typography variant="h3" align='center'>
              Login
            </Typography>
            <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
