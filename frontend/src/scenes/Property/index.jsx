import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Modal,
  IconButton
} from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import VerifiedIcon from '@mui/icons-material/Verified';

const Property = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageData, setImageData] = useState({});

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/properties/pending");
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (propertyId) => {
    try {
      setLoading(true);
      await fetch(`https://renteaseadmin.onrender.com/admin/properties/accept/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification: 'verified' }),
      });
      fetchProperties(); // Refresh the properties after update
    } catch (error) {
      console.error("Error accepting property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (propertyId) => {
    try {
      setLoading(true);
      await fetch(`https://renteaseadmin.onrender.com/admin/properties/reject/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification: 'rejected' }),
      });
      fetchProperties(); // Refresh the properties after update
    } catch (error) {
      console.error("Error rejecting property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handlePrevImage = (propertyId) => {
    setImageData(prevData => ({
      ...prevData,
      [propertyId]: {
        ...prevData[propertyId],
        currentIndex: (prevData[propertyId]?.currentIndex === 0
          ? (prevData[propertyId]?.image?.length || 1) - 1
          : (prevData[propertyId]?.currentIndex || 0) - 1)
      }
    }));
  };

  const handleNextImage = (propertyId) => {
    setImageData(prevData => ({
      ...prevData,
      [propertyId]: {
        ...prevData[propertyId],
        currentIndex: (prevData[propertyId]?.currentIndex === (prevData[propertyId]?.image?.length || 1) - 1
          ? 0
          : (prevData[propertyId]?.currentIndex || 0) + 1)
      }
    }));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <Box m="20px">
      <Header title="PROPERTY VERIFICATION" subtitle="List of Properties to be verified" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : properties.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No properties available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  position: 'relative'
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" display="flex" alignItems="center">
                    {property.property_name}
                    {property.verification === 'verified' && (
                      <VerifiedIcon sx={{ color: '#00aaff', ml: 1 }} />
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Category:</strong> {property.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> ${property.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {property.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created Date:</strong> {new Date(property.createdAt).toLocaleDateString()}
                  </Typography>

                  {property.image.length > 0 && (
                    <Box mt="10px" position="relative">
                      <CardMedia
                        component="img"
                        height="140"
                        image={`https://renteasebackend-orna.onrender.com/uploads/${property.image[imageData[property._id]?.currentIndex || 0]}`}
                        alt="property"
                        sx={{ borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => handleOpenModal(property.image[imageData[property._id]?.currentIndex || 0])}
                      />
                      {property.image.length > 1 && (
                        <>
                          <IconButton
                            onClick={() => handlePrevImage(property._id)}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: 10,
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                            }}
                            disabled={(imageData[property._id]?.currentIndex || 0) === 0}
                          >
                            <ArrowBack />
                          </IconButton>
                          <IconButton
                            onClick={() => handleNextImage(property._id)}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              right: 10,
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                            }}
                            disabled={(imageData[property._id]?.currentIndex || 0) === (property.image.length - 1)}
                          >
                            <ArrowForward />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" mt="10px" gap="10px">
                    <img
                      src={`https://renteasebackend-orna.onrender.com/uploads/${property.ownerProfilePic}`}
                      alt="Owner"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <Typography variant="body2">
                      <strong>Owner:</strong> {property.ownerName}
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" mt="10px" gap="10px">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(property._id)}
                      disabled={property.verification === 'verified'}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleReject(property._id)}
                      disabled={property.verification === 'rejected'}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal
        open={open}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '60%',
            maxWidth: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            padding: '20px',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
            }}
          >
            <Close />
          </IconButton>
          <img
            src={`https://renteasebackend-orna.onrender.com/uploads/${selectedImage}`}
            alt="Property"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Property;
