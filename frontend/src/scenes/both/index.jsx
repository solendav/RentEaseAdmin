import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Avatar, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Both = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/users/both");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    const isProfileComplete = user.first_name && user.phone_number && user.address;

    if (isProfileComplete) {
      setSelectedUser(user);
      setOpen(true);
    } else {
      alert("This profile is not complete yet.");
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleCloseImageDialog = () => {
    setImageOpen(false);
    setSelectedImage("");
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box m="20px">
      <Header title="USERS WITH BOTH ROLES" subtitle="" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : users.length === 0 ? (
        <Typography variant="h6" textAlign="center" color={isDarkMode ? "white" : "black"}>
          No users with both roles available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                sx={{
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#f5f5f5', // Adjusted background color
                  boxShadow: isDarkMode ? '0 4px 8px rgba(255, 255, 255, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
                }}
              >
                <Avatar
                  src={`https://renteasebackend-orna.onrender.com/uploads/${user.profile_picture}`}
                  alt={user.user_name}
                  sx={{
                    width: 80,
                    height: 80,
                    marginRight: 2,
                    border: '2px solid #3498db',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImageClick(`https://renteasebackend-orna.onrender.com/uploads/${user.profile_picture}`)}
                />
                <Box>
                  <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', color: isDarkMode ? 'white' : 'black' }}>
                    {user.user_name}
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? 'white' : 'text.secondary'}>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? 'white' : 'text.secondary'}>
                    <strong>Role:</strong> Both
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(user)}>
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedUser && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                PaperProps={{
                  sx: {
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
        >
          <DialogTitle sx={{ color: isDarkMode ? 'white' : 'black' }}>User Details</DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center">
              <Avatar
                src={`https://renteasebackend-orna.onrender.com/uploads/${selectedUser.profile_picture}`}
                alt={`${selectedUser.user_name}`}
                sx={{
                  width: 100,
                  height: 100,
                  marginRight: 2,
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1.25rem', color: isDarkMode ? 'white' : 'black' }}>
                  {`${selectedUser.first_name} ${selectedUser.middle_name || ''}`}
                </Typography>
                <Typography variant="body2" color={isDarkMode ? 'white' : 'text.secondary'}>
                  <strong>Phone:</strong> {selectedUser.phone_number}
                </Typography>
                <Typography variant="body2" color={isDarkMode ? 'white' : 'text.secondary'}>
                  <strong>Address:</strong> {selectedUser.address}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Image Popup Dialog */}
      <Dialog open={imageOpen} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={selectedImage}
              alt="Profile"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '500px',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Both;
