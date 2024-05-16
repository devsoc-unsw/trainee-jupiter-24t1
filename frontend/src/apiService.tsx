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
// User authentication functions
/**
 * Helper function to make API requests.
 * @param path The API endpoint path.
 * @param method The HTTP method ('GET', 'POST', 'PUT', etc.).
 * @param body Optional body for POST/PUT requests, provided as an object.
 */
const apiCall = (path: string, method: string, body?: NonNullable<unknown>): Promise<any> => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => reject(new Error(errorData.error || 'Failed to process request')));
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

/**
 * Logs in a user with provided email and password.
 */
// User authentication function for logging in
export const login = (email: string, password: string): Promise<AuthResponse | ErrorResponse> => {
  return apiCall('user/auth/login', 'POST', { email, password })
    .then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token); // Store the token in localStorage
      }
      return data;
    });
};

/**
 * Registers a new user with provided email, password, and name.
 */
// Function to register a new user
export const register = (email: string, password: string, name: string): Promise<AuthResponse | ErrorResponse> => {
  return apiCall('user/auth/register', 'POST', { email, password, name })
    .then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token); // Store the token in localStorage
      }
      return data;
    });
};

export const logout = (): Promise<void> => {
  return apiCall('user/auth/logout', 'POST')
    .then(() => {
      localStorage.removeItem('authToken'); // Remove the token from localStorage
    });
};

export const getNearbyEvents = (location: string): Promise<Event[]> => {
  return apiCall(`events?location=${location}`, 'GET');
};

// Function to fetch nearby restaurants
export const getNearbyRestaurants = (location: string): Promise<Restaurant[]> => {
  return apiCall(`restaurants?location=${location}`, 'GET');
};

// Function to fetch nearby accommodations
export const getNearbyAccommodation = (location: string): Promise<Accommodation[]> => {
  return apiCall(`accommodations?location=${location}`, 'GET');
};
