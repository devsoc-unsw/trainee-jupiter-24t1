import { List } from "@mui/material";
import RestaurantListItem from "../RestaurantListItem";
import { RestaurantRecommendation, getUserByEmail, recommend } from "../apiService";
import { useEffect, useState } from "react";
import { User } from "../types";

const Recommendation = () => {
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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await getUserByEmail(email);
          setUser(response);
          handleRecommendButtonClick(response);
        } catch (err) {
          setError('Failed to fetch user details');
        }
      }
    }
    fetchUserDetails();
  }, [])

  const recommendRestaurants = async (city: string, userInterests: string[], isVegetarian: boolean, isGlutenFree: boolean, minRating: number): Promise<RestaurantRecommendation[]> => {
    const response = await recommend(city, userInterests, isVegetarian, isGlutenFree, minRating);

    return response;
  };

  const handleRecommendButtonClick = async (userArg: User) => {
    try {
      const fetchedRecommendations = await recommendRestaurants(userArg.location, [
        'Cheap Eats', 
        'French', 
        'Reservations', 
        'Seating', 
        'Wheelchair Accessible', 
        'Serves Alcohol', 
        'Accepts Credit Cards', 
        'Table Service',
      ], userArg.isVegetarian, userArg.isGlutenFree, 0);
      setRecommendations(fetchedRecommendations);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <section>
        <img src="https://media-cdn.tripadvisor.com/media/photo-w/11/f7/d0/a1/akira-back.jpg" alt="restaurant heading" />
        <div>
          <p>These are recommended for you that we believe</p>
          <h2>Best Matches of Your Interests</h2>
        </div>
      </section>
      <section>
        {error}
      </section>
      <section>
        Hi, {user.name}
      </section>
      <section>
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
      </section>
    </div>
  )
}

export default Recommendation;
