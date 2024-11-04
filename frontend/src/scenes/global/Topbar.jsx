import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { fetchVerifiedProperties, fetchVerifiedProfiles } from "../../api/notifications";

const Topbar = ({ onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [profileCount, setProfileCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [animateBell, setAnimateBell] = useState(false); // For animation
  const [notificationPopoverAnchor, setNotificationPopoverAnchor] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(["account", "property", "transaction"]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
    handleClose();
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    onLogout(); // Notify parent component
    navigate("/"); // Redirect to login page
    setOpenLogoutDialog(false);
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const handleProfile = () => {
    setUserId('123'); // Example userId
    setProfileDialogOpen(true);
    handleClose();
  };

  const fetchNotifications = async () => {
    try {
      const properties = await fetchVerifiedProperties();
      const profiles = await fetchVerifiedProfiles();
      setPropertyCount(properties.length);
      setProfileCount(profiles.length);
      setNotifications([...properties, ...profiles]); // Combine notifications if needed

      if (properties.length > 0 || profiles.length > 0) {
        setAnimateBell(true); // Trigger animation
        setTimeout(() => setAnimateBell(false), 1000); // Reset animation after 1 second
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchNotifications(); // Fetch notifications every 10 seconds
    }, 1000); // 10000 milliseconds = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = () => {
    navigate("/notifications"); // Navigate to the notifications page
  };

  const handleNotificationClose = () => {
    setNotificationPopoverAnchor(null);
  };

  const handleFilterChange = (event, newFilters) => {
    setSelectedFilters(newFilters);
    // Implement your filtering logic here based on newFilters
  };

  const filteredNotifications = notifications.filter(notification => {
    // Add your filtering logic based on selectedFilters here
    return selectedFilters.includes(notification.type); // Assuming `type` field exists in your notification objects
  });

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={propertyCount + profileCount} color="error">
            <NotificationsOutlinedIcon className={animateBell ? 'bell-animation' : ''} />
          </Badge>
        </IconButton>
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
        >
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 1 }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={cancelLogout}
        aria-labelledby="logout-confirmation-dialog"
        maxWidth="sm" // Set dialog width to medium size
        fullWidth
      >
        <DialogTitle id="logout-confirmation-dialog" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textPrimary">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
