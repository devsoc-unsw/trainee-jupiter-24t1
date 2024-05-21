import React, { useState } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import { getNearbyEvents, getNearbyRestaurants, getNearbyAccommodation, Event, Restaurant, Accommodation, RestaurantRecommendation, recommend } from './apiService';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [preferences, setPreferences] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [error, setError] = useState('');

  const [recommendations, setRecommendations] = useState<RestaurantRecommendation[]>([]);

  const handleSearch = () => {
    if (!location || !startDate || !endDate || !interests || !preferences) {
      setError('Please fill in all fields');
      return;
    }

    Promise.all([
      getNearbyEvents(location),
      getNearbyRestaurants(location),
      getNearbyAccommodation(location)
    ])
      .then(([eventsData, restaurantsData, accommodationsData]) => {
        setEvents(eventsData);
        setRestaurants(restaurantsData);
        setAccommodations(accommodationsData);
        setError('');
      })
      .catch(err => {
        setError('Failed to fetch suggestions');
        console.error(err);
      });
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleCloseError = () => {
    setError('');
  };

  const recommendRestaurants = async (city: string, userInterests: string[]): Promise<RestaurantRecommendation[]> => {
    const response = await recommend(city, userInterests);

    return response;
  };

  const handleRecommendButtonClick = async () => {
    try {
      const fetchedRecommendations = await recommendRestaurants('Paris', [
        'Cheap Eats', 
        'French', 
        'Reservations', 
        'Seating', 
        'Wheelchair Accessible', 
        'Serves Alcohol', 
        'Accepts Credit Cards', 
        'Table Service',
      ]);
      setRecommendations(fetchedRecommendations);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box p={3}>
      <Button onClick={handleRecommendButtonClick}>Recommend</Button>
      <Typography variant="h4" gutterBottom>{JSON.stringify(recommendations)}</Typography>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <TextField
        label="Enter location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSearch()}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Holiday Start Date"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Holiday End Date"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Interests"
        value={interests}
        onChange={e => setInterests(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Preferences"
        value={preferences}
        onChange={e => setPreferences(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSearch} variant="contained" color="primary" sx={{ mt: 2 }}>Search</Button>
      <Button onClick={handleLogoutClick} variant="contained" color="error" sx={{ mt: 2, ml: 2 }}>Logout</Button>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={handleCloseError}
          message={error}
          action={
            <Button color="secondary" size="small" onClick={handleCloseError}>
              Close
            </Button>
          }
        />
      )}
      <Box mt={4}>
        <Typography variant="h5">Events</Typography>
        <List>
          {events.map((event, index) => (
            <ListItem key={index}>
              <ListItemText primary={event.name} secondary={event.date} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Restaurants</Typography>
        <List>
          {restaurants.map((restaurant, index) => (
            <ListItem key={index}>
              <ListItemText primary={restaurant.name} secondary={restaurant.address} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Accommodation</Typography>
        <List>
          {accommodations.map((accommodation, index) => (
            <ListItem key={index}>
              <ListItemText primary={accommodation.name} secondary={accommodation.address} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Dashboard;
