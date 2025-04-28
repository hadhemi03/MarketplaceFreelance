// material-ui 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
//import menuItem from 'menu-items';

import dashboard from '../../../../../menu-items/dashboard';
import users from '../../../../../menu-items/users';
import Projects from 'menu-items/projects';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const menuItems = {
    items: [dashboard, users, Projects]
  };
  const navGroups = menuItems.items.map((item) => {
    return (
      <NavGroup key={item.id} item={item} />
    );
  });

  return (
    <Box sx={{ pt: 2 }}>
      
      {navGroups}
    </Box>
  );
}
