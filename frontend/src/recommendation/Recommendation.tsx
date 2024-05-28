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
    <div className="flex flex-col items-center">
      <section className="w-full relative h-[40vh] overflow-hidden">
        <img
          src="https://media-cdn.tripadvisor.com/media/photo-w/11/f7/d0/a1/akira-back.jpg"
          alt="restaurant heading"
          className="absolute top-1/2 left-1/2 w-full h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <div className="absolute bottom-0 w-full text-center bg-opacity-50 bg-black text-white py-4">
          <p>These are recommended for you that we believe</p>
          <h2 className="text-2xl font-bold">Best Matches of Your Interests</h2>
        </div>
      </section>
      <section className="mt-4 text-red-500">
        {error}
      </section>
      <section className="mt-4 text-xl">
        Hi, {user.name}
      </section>
      <section className="mt-8 w-3/5">
        <div className="justify-center grid gap-6">
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
              restaurantCuisines={recommendation.cuisines.split(',').map(word => word.trim())}
              />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recommendation;
