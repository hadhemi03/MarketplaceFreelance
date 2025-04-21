import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';


import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { menuItems as navigation } from './Header/HeaderContent'; // Import menuItems from HeaderContent.js


// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  // Assuming you are storing user info in localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';  // Check if the user is admin

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  // If the user is not admin, redirect them
  if (!isAdmin) {
    return <Navigate to="/" />;  // Redirect non-admin users
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      {isAdmin && <Drawer />}  {/* Only show Drawer if user is admin */}
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
}