export interface User {
  name: string;
  password: string;
  location: string;
  preferences: string[];
  isVegetarian: boolean;
  isGlutenFree: boolean;
  sessionActive: boolean;
}

export interface RestaurantListItemType {
  img: string, 
  restaurantName: string, 
  restaurantAward: string,
  restaurantCountry: string,
  restaurantCity: string,
  restaurantRating: string,
  restaurantAddress: string,
  restaurantCuisines: string[],
}
