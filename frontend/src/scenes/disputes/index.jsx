import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, Grid, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get('https://renteaseadmin.onrender.com/admin/disputes'); // Update with your backend URL
        setDisputes(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const handleOpenDialog = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box m="20px">
      {/* Title Section */}
      <Typography variant="h3" fontWeight="bold" mb={4}>
        Disputes Section
      </Typography>

      {/* No Disputes Text */}
      {disputes.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No disputes available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {disputes.map((dispute) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dispute._id}>
              <Paper elevation={3} sx={{ padding: "16px", position: "relative" }}>
                {/* Dispute Thumbnail Images */}
                <Box display="flex" flexDirection="row" gap={1} mb={2}>
                  {dispute.image.map((img, index) => (
                    <img
                      key={index}
                      src={`https://renteasebackend-orna.onrender.com/uploads/${img}`}
                      alt={`Dispute Image ${index + 1}`}
                      style={{ width: "80px", height: "80px", cursor: "pointer", objectFit: "cover" }}
                      onClick={() => handleOpenDialog(`https://renteasebackend-orna.onrender.com/uploads/${img}`)}
                    />
                  ))}
                </Box>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {dispute.description}
                </Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  Estimation: ${dispute.estimation}
                </Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  Property: {dispute.property ? dispute.property.name : "N/A"}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Property Price: ${dispute.property ? dispute.property.price : "N/A"}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Solved: {dispute.solved ? "Yes" : "No"}
                </Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  Disagreed: {dispute.disagree ? "Yes" : "No"}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "16px" }}
                  onClick={() => {/* Add your resolve logic here */}}
                >
                  Resolve
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Viewing Enlarged Image */}
      {selectedImage && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Dispute Image</DialogTitle>
          <DialogContent>
            <img src={selectedImage} alt="Enlarged Dispute" style={{ width: "100%", height: "auto" }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DisputesPage;
