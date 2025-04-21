{/*// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
//import menuItem from 'menu-items';


// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const navGroups = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
*/}

// material-ui 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
//import menuItem from 'menu-items';

import dashboard from '../../../../../menu-items/dashboard';
import users from '../../../../../menu-items/users';
import support from '../../../../../menu-items/support';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const menuItems = {
    items: [dashboard, users, support]
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
