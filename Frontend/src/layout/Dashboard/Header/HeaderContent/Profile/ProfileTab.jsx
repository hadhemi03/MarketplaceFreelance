import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // Load the current user from localStorage on component mount
  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (userFromLocalStorage) {
      setCurrentUser(userFromLocalStorage);
    } else {
      setCurrentUser(null); // Set to null if no user found
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear the user data from localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');

      // Reset the state after logout
      setCurrentUser(null);
      setSelectedIndex(0);

      // Call your backend logout API (if necessary)
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });

      // Redirect to the home page or login page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    if (path) navigate(path);
  };


  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/*<ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/apps/profiles/account/basic')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>
*/}
      <ListItemButton selected={selectedIndex === 3} onClick={() => handleListItemClick(3, '/freelancer/my-profile')}>
        <ListItemIcon>
          <ProfileOutlined />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
