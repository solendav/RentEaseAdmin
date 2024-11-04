import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";

const Tenants = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/users/tenant");
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setOpen(true);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTenant(null);
  };

  const handleCloseImageDialog = () => {
    setImageOpen(false);
    setSelectedImage("");
  };

  return (
    <Box m="20px">
      <Header title="TENANTS" subtitle="List of Tenants" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : tenants.length === 0 ? (
        <Typography variant="h6" textAlign="center" color={isDarkMode ? 'white' : 'black'}>
          No tenants available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tenants.map((tenant) => (
            <Grid item xs={12} sm={6} md={4} key={tenant._id}>
              <Card
                sx={{
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  boxShadow: isDarkMode
                    ? '0 4px 8px rgba(0, 0, 0, 0.6)' // Dark mode shadow
                    : '0 4px 12px rgba(0, 0, 0, 0.2)', // Light mode shadow
                  borderRadius: '16px',
                  border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                  padding: '16px',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={`https://renteasebackend-orna.onrender.com/uploads/${tenant.profile_picture}`}
                      alt={tenant.user_name}
                      sx={{
                        width: 80,
                        height: 80,
                        marginRight: 2,
                        border: '2px solid #3498db',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(`https://renteasebackend-orna.onrender.com/uploads/${tenant.profile_picture}`)}
                    />
                    <Typography variant="h5" component="div" color={isDarkMode ? 'white' : 'black'}>
                      {tenant.user_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={isDarkMode ? 'grey.400' : 'text.secondary'}>
                    <strong>Email:</strong> {tenant.email}
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? 'grey.400' : 'text.secondary'}>
                    <strong>Role:</strong> Tenant
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(tenant)}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTenant && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Tenant Details</DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={`https://renteasebackend-orna.onrender.com/uploads/${selectedTenant.profile_picture}`}
                alt={selectedTenant.user_name}
                sx={{ width: 80, height: 80, marginRight: 2 }}
              />
              <Typography variant="h6" color={isDarkMode ? 'white' : 'black'}>
                {`${selectedTenant.first_name} ${selectedTenant.middle_name || ''} ${selectedTenant.last_name || ''}`}
              </Typography>
            </Box>
            <Typography variant="body2" color={isDarkMode ? 'grey.400' : 'text.secondary'}>
              <strong>Phone:</strong> {selectedTenant.phone_number}
            </Typography>
            <Typography variant="body2" color={isDarkMode ? 'grey.400' : 'text.secondary'}>
              <strong>Address:</strong> {selectedTenant.address}
            </Typography>
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

export default Tenants;
