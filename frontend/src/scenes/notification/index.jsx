import React, { useState, useEffect } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Badge, Button, Card, CardContent, CardActions, Divider, CircularProgress, useTheme } from '@mui/material';
import { fetchVerifiedProfiles, fetchVerifiedProperties } from '../../api/notifications';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [selectedToggle, setSelectedToggle] = useState('accounts'); // Default selected toggle
  const [accounts, setAccounts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const theme = useTheme();
  const navigate = useNavigate();

  const handleToggleChange = async (event, newToggle) => {
    if (newToggle !== null) {
      setSelectedToggle(newToggle);
      setLoading(true); // Set loading when the toggle changes
      await fetchData(newToggle); // Fetch the data based on the new toggle
      setLoading(false); // Stop loading once data is fetched
    }
  };

  const fetchData = async (toggleValue) => {
    try {
      if (toggleValue === 'accounts') {
        const profilesData = await fetchVerifiedProfiles();
        setAccounts(profilesData);
      } else if (toggleValue === 'properties') {
        const propertiesData = await fetchVerifiedProperties();
        setProperties(propertiesData);
      }
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData(selectedToggle); 
  }, [selectedToggle]); // Add selectedToggle to dependency array

  const handleViewDetails = (id) => {
    if (selectedToggle === 'accounts') {
      navigate('/account');
    } else if (selectedToggle === 'properties') {
      navigate('/property');
    }
  };

  return (
    <Box p={2} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup
          color="primary"
          value={selectedToggle}
          exclusive
          onChange={handleToggleChange}
          aria-label="notification toggle"
          sx={{ display: 'flex' }}
        >
          <ToggleButton
            value="accounts"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.mode === 'light' ? 'black' : 'white'}`,
              '&.Mui-selected': {
                color: theme.palette.mode === 'light' ? '#fff' : '#000', // Text color
                backgroundColor: theme.palette.mode === 'light' ? '#003366' : '#fff', // Background color
                borderColor: theme.palette.mode === 'light' ? '#003366' : '#fff', // Border color
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#555',
              },
            }}
          >
            <Badge badgeContent={accounts.length} color="error">
              Accounts Verification
            </Badge>
          </ToggleButton>

          <ToggleButton
            value="properties"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.mode === 'light' ? 'black' : 'white'}`,
              '&.Mui-selected': {
                color: theme.palette.mode === 'light' ? '#fff' : '#000', // Text color
                backgroundColor: theme.palette.mode === 'light' ? '#003366' : '#fff', // Background color
                borderColor: theme.palette.mode === 'light' ? '#003366' : '#fff', // Border color
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#555',
              },
            }}
          >
            <Badge badgeContent={properties.length} color="error">
              Properties Verification
            </Badge>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box mt={4} display="flex" flexDirection="column" gap={2}>
        {loading ? ( // Show loading spinner when data is being fetched
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} />
          </Box>
        ) : (
          <>
            {selectedToggle === 'accounts' && accounts.map((account, index) => (
              <Card key={account._id} variant="outlined" sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333', color: theme.palette.text.primary }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{index + 1}. {account.first_name} {account.middle_name} {account.last_name}</Typography>
                  <Typography variant="body2">Verification Status: {account.verification}</Typography>
                  <Typography variant="body2">Created Date: {new Date(account.createdAt).toLocaleDateString()}</Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.mode === 'light' ? '#007bff' : '#0056b3',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'light' ? '#0056b3' : '#003d7a',
                      },
                    }}
                    onClick={() => handleViewDetails(account._id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}

            {selectedToggle === 'properties' && properties.map((property, index) => (
              <Card key={property._id} variant="outlined" sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333', color: theme.palette.text.primary }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{index + 1}. {property.property_name}</Typography>
                  <Typography variant="body2">Category: {property.category}</Typography>
                  <Typography variant="body2">Price: ${property.price}</Typography>
                  <Typography variant="body2">Status: {property.status ? 'Active' : 'Inactive'}</Typography>
                  <Typography variant="body2">Created Date: {new Date(property.createdAt).toLocaleDateString()}</Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.mode === 'light' ? '#007bff' : '#0056b3',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'light' ? '#0056b3' : '#003d7a',
                      },
                    }}
                    onClick={() => handleViewDetails(property._id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
