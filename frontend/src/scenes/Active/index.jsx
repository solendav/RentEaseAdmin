import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, TextField, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import './spinner.css'; // Import the custom spinner CSS

const Active = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [activePosts, setActivePosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState(currentPage);
  const [imageIndexes, setImageIndexes] = useState({}); // Track image index for each card

  const fetchActivePosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://renteaseadmin.onrender.com/admin/properties/active?page=${page}&limit=6`
      );
      const data = await response.json();
      setActivePosts(data.properties);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setPageInput(data.currentPage);

      // Initialize image indexes for each post
      const initialIndexes = data.properties.reduce((acc, post) => {
        acc[post._id] = 0; // Set initial image index to 0
        return acc;
      }, {});
      setImageIndexes(initialIndexes);
    } catch (error) {
      console.error("Error fetching active properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePosts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchActivePosts(page);
    }
  };

  const handleInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handleGoClick = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page)) {
      handlePageChange(page);
    }
  };

  // Handle image navigation for specific card
  const handleNextImage = (postId) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[postId];
      const newIndex = (currentIndex + 1) % activePosts.find(post => post._id === postId).image.length;
      return { ...prevIndexes, [postId]: newIndex };
    });
  };

  const handlePrevImage = (postId) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[postId];
      const newIndex = (currentIndex - 1 + activePosts.find(post => post._id === postId).image.length) % activePosts.find(post => post._id === postId).image.length;
      return { ...prevIndexes, [postId]: newIndex };
    });
  };

  return (
    <Box m="20px">
      <Header title="ACTIVE POST" subtitle="List of Active Posts" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <div className="spinner"></div> {/* Custom spinner */}
        </Box>
      ) : activePosts.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No active posts available.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {activePosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Card
                  sx={{
                    backgroundColor: 'transparent',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Added box shadow
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: '140px',
                      overflow: 'hidden',
                      borderRadius: '16px 16px 0 0',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`https://renteasebackend-orna.onrender.com/uploads/${post.image[imageIndexes[post._id]]}`}
                      alt={post.property_name}
                      sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
                    />
                    {post.image.length > 1 && (
                      <>
                        <Button
                          onClick={() => handlePrevImage(post._id)}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                          }}
                        >
                          &lt;
                        </Button>
                        <Button
                          onClick={() => handleNextImage(post._id)}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                          }}
                        >
                          &gt;
                        </Button>
                      </>
                    )}
                  </Box>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {post.property_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Price:</strong> ${post.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {post.status ? "Active" : "Inactive"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {post.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Average Rating:</strong> {post.average_rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong> {post.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {post.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Created Date:</strong> {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" alignItems="center" mt="20px">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              sx={{ marginRight: "10px" }}
            >
              Previous
            </Button>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={pageInput}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1, max: totalPages } }}
              sx={{ width: "70px", textAlign: "center", marginRight: "10px" }}
            />
            <Button variant="contained" color="primary" onClick={handleGoClick} sx={{ marginRight: "10px" }}>
              Go
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Active;
