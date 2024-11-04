import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import VerifiedIcon from '@mui/icons-material/Verified'; // Import VerifiedIcon

const Account = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/profiles");
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (profileId) => {
    try {
      setLoading(true);
      await fetch(`https://renteaseadmin.onrender.com/admin/profiles/verify/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchProfiles(); // Refresh the profiles after update
    } catch (error) {
      console.error("Error verifying profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (profileId) => {
    try {
      setLoading(true);
      await fetch(`https://renteaseadmin.onrender.com/admin/profiles/reject/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchProfiles(); // Refresh the profiles after update
    } catch (error) {
      console.error("Error rejecting profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (profile) => {
    setSelectedProfile(profile);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProfile(null);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <Box m="20px">
      <Header title="ACCOUNT VERIFICATION" subtitle="List of Accounts to be verified" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : profiles.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No profiles available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile._id}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" display="flex" alignItems="center">
                    {profile.first_name} {profile.last_name}
                    {profile.verification === 'verified' && (
                      <VerifiedIcon sx={{ color: '#00aaff', ml: 1 }} /> // Light blue color
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {profile.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {profile.phone_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {profile.address}
                  </Typography>
                  <Box display="flex" flexDirection="column" mt="10px" gap="10px">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleVerify(profile._id)}
                      disabled={profile.verification === 'verified'}
                    >
                      Verify
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleReject(profile._id)}
                      disabled={profile.verification === 'rejected'}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(profile)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedProfile && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Profile Details</DialogTitle>
          <DialogContent>
            {selectedProfile.first_name && selectedProfile.phone_number && selectedProfile.address ? (
              <>
                <Typography variant="body2">Full Name:  {`${selectedProfile.first_name} ${selectedProfile.middle_name || ''} ${selectedProfile.last_name}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {selectedProfile.phone_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {selectedProfile.address}
                </Typography>
                
                <Box mt="10px" textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  <strong>ID image</strong>
                </Typography>
                  {selectedProfile.id_image ? (
                    <img
                      src={`https://renteasebackend-orna.onrender.com/uploads/${selectedProfile.id_image}`}
                      alt="ID Image"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      ID image not available.
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Profile not completed yet.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Account;
