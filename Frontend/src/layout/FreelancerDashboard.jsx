import { Outlet, Navigate } from 'react-router-dom';
import Drawer from "./Dashboard/Drawer";
import Header from './Dashboard/Header';
import { menuItems as navigation } from './Dashboard/Header/HeaderContent'; 
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

const FreelancerDashboard = () => {
  const role = localStorage.getItem('userRole') || 'guest';

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        {role === 'freelancer' ? (
          <Outlet />  // Freelancer-specific pages
        ) : (
          <Navigate to="/" />
        )}
      </Box>
    </Box>
  );
};

export default FreelancerDashboard;
