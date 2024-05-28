import { User } from "./types";

// apiService.ts
const BASE_URL = 'http://localhost:3000'; // Adjust the base URL if needed

export interface Event {
  name: string;
  date: string;
}

export interface Restaurant {
  name: string;
  address: string;
}

export interface Accommodation {
  name: string;
  address: string;
}
// Interface for authentication responses
export interface AuthResponse {
  token: string;
}

// Interface for error responses
export interface ErrorResponse {
  error: string;
}

// Interface for user profile
export interface UserProfile {
  email: string;
  name: string;
  password: string;
}

// User authentication functions
/**
 * Helper function to make API requests.
 * @param path The API endpoint path.
 * @param method The HTTP method ('GET', 'POST', 'PUT', etc.).
 * @param body Optional body for POST/PUT requests, provided as an object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiCall = async (path: string, method: string, body?: NonNullable<unknown>): Promise<any> => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/${path}`, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to process request');
  }
  return data;
};

/**
 * Logs in a user with provided email and password.
 */
// User authentication function for logging in
export const login = async (email: string, password: string): Promise<AuthResponse | ErrorResponse> => {
  const data = await apiCall('user/auth/login', 'POST', { email, password });
  if (data.token) {
    localStorage.setItem('authToken', data.token); // Store the token in localStorage
  }
  return data;
};

/**
 * Registers a new user with provided email, password, and name.
 */
// Function to register a new user
export const register = async (email: string, password: string, name: string, location: string, preferences: string[], isVegetarian: boolean, isGlutenFree: boolean): Promise<AuthResponse | ErrorResponse> => {
  const data = await apiCall('user/auth/register', 'POST', { email, password, name, location, preferences, isVegetarian, isGlutenFree });
  if (data.token) {
    localStorage.setItem('authToken', data.token); // Store the token in localStorage
    localStorage.setItem('email', email);
  }
  return data;
};

export const logout = (): Promise<void> => {
  return apiCall('user/auth/logout', 'POST')
    .then(() => {
      localStorage.removeItem('authToken'); // Remove the token from localStorage
    });
};

export interface RestaurantRecommendation {
  restaurant_name: string;
  country: string;
  city: string;
  address: string;
  popularity_detailed: string;
  cuisines: string;
  avg_rating: string;
  tokens: string[];
}

export const recommend = async (city: string, userInterests: string[], isVegetarian: boolean, isGlutenFree: boolean, minRating: number = 0): Promise<RestaurantRecommendation[]> => {
  const data = await apiCall('recommend/restaurants', 'POST', { city, userInterests, isVegetarian, isGlutenFree, minRating });
  return data;
};

export const getUserByEmail = async(email: string): Promise<User> => {
  const data = await apiCall(`api/user?email=${email}`, 'GET');
  return data;
}

export const getProfile = async (): Promise<UserProfile> => {
  const data = await apiCall('user/profile', 'GET');
  return data;
};


export const editProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const data = await apiCall('user/profile', 'PATCH', updates);
  return data;
};
