import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

export default function Register() {
  return (
    <AuthWrapper>
      <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={15}>
            <Typography variant="h3">Sign up</Typography>
            <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Already have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <AuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
