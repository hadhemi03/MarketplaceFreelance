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

export default function Notification() {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get("http://localhost:5000/api/notifications/get-notif", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Notifications:", res.data); // Log notifications to verify API response
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading notifications...</div>;
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        sx={{ color: 'text.primary' }}
        ref={anchorRef}
        aria-controls={open ? 'notification-popover' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notifications.length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        role={undefined}
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10], // Adjust the vertical offset for better positioning
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport', // Prevents the popper from being clipped
              },
            },
            {
              name: 'flip',
              options: {
                enabled: true,
              },
            },
          ],
        }}
      >
        <Paper sx={{
          boxShadow: theme.customShadows.z1, 
          width: '100%', 
          minWidth: 285,
          position: 'absolute',
          right: 0, // Ensures the popper is aligned on the right
        }}>
          <ClickAwayListener onClickAway={handleClose}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Notifications</Typography>
              <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                  <div key={notification._id}>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>N</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message}
                        secondary={new Date(notification.createdAt).toLocaleString()}
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                  </div>
                ))}
              </List>
              <Tooltip title="Mark as all read">
                <IconButton color="success" size="small" onClick={() => setNotifications([])}>
                  <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Box>
  );
}
