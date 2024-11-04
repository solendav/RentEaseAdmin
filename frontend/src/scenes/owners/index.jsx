import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";

const Owners = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/users/landlord");
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleViewDetails = (owner) => {
    setSelectedOwner(owner);
    setOpen(true);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOwner(null);
  };

  const handleCloseImageDialog = () => {
    setImageOpen(false);
    setSelectedImage("");
  };

  return (
    <Box m="20px">
      <Header title="OWNERS" subtitle="List of Owners" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : owners.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No owners available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {owners.map((owner) => (
            <Grid item xs={12} sm={6} md={4} key={owner._id}>
              <Card
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', // Adjust background color based on theme mode
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  padding: '16px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={`https://renteasebackend-orna.onrender.com/uploads/${owner.profile_picture}`}
                      alt={owner.user_name}
                      sx={{
                        width: 80,
                        height: 80,
                        marginRight: 2,
                        border: '2px solid #3498db',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(`https://renteasebackend-orna.onrender.com/uploads/${owner.profile_picture}`)}
                    />
                    <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      {owner.user_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {owner.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Role:</strong> Owner
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(owner)}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedOwner && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Owner Details</DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center">
              <Avatar
                src={`https://renteasebackend-orna.onrender.com/uploads/${selectedOwner.profile_picture}`}
                alt={`${selectedOwner.user_name}`}
                sx={{
                  width: 100,
                  height: 100,
                  marginRight: 2,
                }}
              />
              <Box>
                <Typography variant="h6">{`${selectedOwner.first_name} ${selectedOwner.middle_name || ''} `}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {selectedOwner.phone_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {selectedOwner.address}
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

export default Owners;
