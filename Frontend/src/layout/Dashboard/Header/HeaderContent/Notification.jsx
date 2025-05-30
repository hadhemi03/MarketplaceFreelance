import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { initSocket } from 'utils/Socket';

export default function Notification() {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get("http://localhost:5000/api/notifications/get-notif", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.slice(0, 20));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Socket connection and notification handling
useEffect(() => {
  const token = localStorage.getItem('token');

  const handleNewNotification = (newNotification) => {
    console.log('Raw notification received:', newNotification);

    setNotifications(prev => {
      const transformedNotif = {
        _id: newNotification._id || Math.random().toString(36).substr(2, 9),
        message: newNotification.message,
        createdAt: newNotification.createdAt || new Date()
      };

      if (prev.some(n => n._id === transformedNotif._id)) {
        console.log('Duplicate detected, skipping');
        return prev;
      }

      console.log('Adding new notification:', transformedNotif);
      return [transformedNotif, ...prev];
    });
  };

  // ✅ Pass token and callback in correct order
  socketRef.current = initSocket(token, handleNewNotification);

  return () => {
    if (socketRef.current) {
      socketRef.current.off('newNotification', handleNewNotification);
    }
  };
}, []);


  // Debug effect
  useEffect(() => {
    console.log('Current notifications state:', notifications);
  }, [notifications]);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading notifications...</div>;
  }

  const unreadCount = notifications.length;


  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        sx={{ color: 'text.primary' }}
        ref={anchorRef}
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <BellOutlined />
        </Badge>

      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
      >
        <Paper sx={{ width: 350, maxHeight: 400, overflow: 'auto' }}>
          <ClickAwayListener onClickAway={handleClose}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Notifications</Typography>
              <List>
                {notifications.length === 0 ? (
                  <Typography variant="body2" sx={{ p: 2 }}>
                    No new notifications
                  </Typography>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification._id}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>N</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.message}
                          secondary={new Date(notification.createdAt).toLocaleString()}
                        />
                      </ListItemButton>
                      <Divider />
                    </div>
                  ))
                )}
              </List>
            </Box>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Box>
  );
}