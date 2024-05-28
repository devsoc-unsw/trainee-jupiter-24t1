import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, List, Snackbar } from '@mui/material';
import { RestaurantRecommendation, recommend, getUserByEmail } from './apiService';
import RestaurantListItem from './RestaurantListItem';
import { User } from './types';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout }) => {
  // const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User>({
    name: "",
    password: "",
    location: "",
    preferences: [],
    isVegetarian: false,
    isGlutenFree: false,
    sessionActive: false,
  });

  const [recommendations, setRecommendations] = useState<RestaurantRecommendation[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await getUserByEmail(email);
          setUser(response);
        } catch (err) {
          setError('Failed to fetch user details');
        }
      }
    }

    fetchUserDetails();
  }, [])

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleCloseError = () => {
    setError('');
  };

  const recommendRestaurants = async (city: string, userInterests: string[], isVegetarian: boolean, isGlutenFree: boolean, minRating: number): Promise<RestaurantRecommendation[]> => {
    const response = await recommend(city, userInterests, isVegetarian, isGlutenFree, minRating);

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
      ], user.isVegetarian, user.isGlutenFree, 0);
      setRecommendations(fetchedRecommendations);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box p={3}>
      <Button onClick={handleRecommendButtonClick}>Recommend</Button>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {/* <TextField
        label="Enter location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSearch()}
        fullWidth
        margin="normal"
      /> */}
      <TextField
        label="Your preferences"
        value={preferences}
        onChange={e => setPreferences(e.target.value)}
        fullWidth
        margin="normal"
      />
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
      {/* <Box mt={4}>
        <Typography variant="h5">Events</Typography>
        <List>
          {events.map((event, index) => (
            <ListItem key={index}>
              <ListItemText primary={event.name} secondary={event.date} />
            </ListItem>
          ))}
        </List>
      </Box> */}
      <Box mt={4}>
        <Typography variant="h5">Restaurants</Typography>
        <List>
        {recommendations.map((recommendation, index) => (
        <RestaurantListItem 
          key={index}
          img = 'ok' 
          restaurantName={recommendation.restaurant_name}
          restaurantAward={recommendation.popularity_detailed}
          restaurantCountry={recommendation.country}
          restaurantCity={recommendation.city}
          restaurantRating={recommendation.avg_rating}
          restaurantAddress={recommendation.address}
          />
      ))}
        </List>
      </Box>
      {/* <Box mt={4}>
        <Typography variant="h5">Accommodation</Typography>
        <List>
          {accommodations.map((accommodation, index) => (
            <ListItem key={index}>
              <ListItemText primary={accommodation.name} secondary={accommodation.address} />
            </ListItem>
          ))}
        </List>
      </Box> */}
    </Box>
  );
}

export default Dashboard;
