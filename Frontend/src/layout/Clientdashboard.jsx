import { Outlet, Navigate } from 'react-router-dom';

import Drawer from "./Dashboard/Drawer";
import Header from './Dashboard/Header';
import { menuItems as navigation } from '././Dashboard/Header/HeaderContent'; // Import menuItems from HeaderContent.js
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

const ClientDashboard = () => {
    const role = localStorage.getItem('userRole') || 'guest'; // Default to 'guest' if role is not found

console.log("Role:", role);  // Debugging

return (
  <Box sx={{ display: 'flex', width: '100%' }}>
    <Header />
    <Drawer />
    <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Toolbar />
      <Breadcrumbs navigation={navigation} title />
      {role === 'client' ? (
        <Outlet />  // Client-specific routes
      ) : (
        <Navigate to="/" />  // Redirect to login if not a client
      )}
    </Box>
  </Box>
);

  };
export default ClientDashboard;