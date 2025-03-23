// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import projects from './projects';
import clientprofile from './clientprofile';

// ==============================|| MENU ITEMS ||============================== //

/*const menuItems = {
  items: [dashboard, pages, utilities, support]
};

export default menuItems;*/

const getMenuItems = (role) => {
  if (role === 'client') {
    return {
      items: [ projects, clientprofile]
    };
  } else {
    return {
      items: [dashboard, pages, utilities, support]
    };
  }
};

const role = localStorage.getItem('userRole'); // Retrieve the user's role (client or admin)

const menuItems = getMenuItems(role);  // Get the menu items based on the role

export default menuItems;
