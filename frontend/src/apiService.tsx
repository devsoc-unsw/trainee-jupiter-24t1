// apiService.ts
const BASE_URL = 'http://localhost:3000'; // Adjust the base URL if needed

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
export const register = async (email: string, password: string, name: string): Promise<AuthResponse | ErrorResponse> => {
  const data = await apiCall('user/auth/register', 'POST', { email, password, name });
  if (data.token) {
    localStorage.setItem('authToken', data.token); // Store the token in localStorage
  }
  return data;
};

export const logout = async (): Promise<void> => {
  await apiCall('user/auth/logout', 'POST');
  localStorage.removeItem('authToken'); // Remove the token from localStorage
};