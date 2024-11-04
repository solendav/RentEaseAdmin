import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, useTheme, List, ListItem, ListItemAvatar, ListItemText, Avatar, Dialog, DialogContent, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";

const Rented = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  // Function to fetch rented items
  const fetchRentedItems = async () => {
    try {
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/rented");
      setRentedItems(response.data);
    } catch (err) {
      setError("Failed to fetch rented items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentedItems();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box m="20px">
      <Header title="RENTED ITEMS" subtitle="List of Rented Items" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : rentedItems.length === 0 ? (  // Display this if there are no rented items
        <Typography variant="h6" align="center" color="textSecondary">
          There are no rented items at the moment.
        </Typography>
      ) : (
        <List>
          {rentedItems.map((item, index) => (
            <ListItem
              key={item._id}
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
                borderRadius: "10px",
                mb: 2,
                boxShadow: theme.palette.mode === "dark" ? "0px 4px 8px rgba(0, 0, 0, 0.6)" : "0px 4px 8px rgba(0, 0, 0, 0.1)",
                color: theme.palette.mode === "dark" ? "#ecf0f1" : "#000000",
                display: 'flex',
                alignItems: 'center',
                p: 2,
                gap: 2
              }}
            >
              <Avatar
                src={`https://renteasebackend-orna.onrender.com/uploads/${item.property_image}`}
                alt="Property Image"
                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                onClick={() => handleImageClick(item.property_image)}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="body1">
                  <strong>Tenant:</strong> {item.tenant_username}
                </Typography>
                <Typography variant="body1">
                  <strong>Owner:</strong> {item.owner_username}
                </Typography>
                <Typography variant="body1">
                  <strong>Start Date:</strong> {new Date(item.start_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>End Date:</strong> {new Date(item.end_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Price:</strong> ${item.totalPrice}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {item.status}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[700] : "#eeeeee",
                  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: 2,
          }
        }}
      >
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.text.primary
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={`https://renteasebackend-orna.onrender.com/uploads/${selectedImage}`}
            alt="Enlarged Property"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Rented;
