import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Snackbar } from '@mui/material';
import Dashboard from './Dashboard';
import { login, register, logout, AuthResponse, ErrorResponse } from './apiService';
import MultistepForm from './MultistepForm/MultistepForm';

const App = () => {
  // States
  const [isLogged, setIsLogged] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState<string>('');

  const isAuthResponse = (response: AuthResponse | ErrorResponse): response is AuthResponse => {
    return (response as AuthResponse).token !== undefined;
  };

  // login function
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await login(loginEmail, loginPassword);

      if (isAuthResponse(response)) {
        setIsLogged(true);
        setLoginEmail('')
        setLoginPassword(''); // clearing password field upon login
      } else {
        setError('Login failed: ' + response.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('Login request failed: ' + error.message);
      } else {
        setError('Login request failed');
      }
    }
  };


  // register function
  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !registerName || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      // clearing register password fields
      setRegisterPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      const response = await register(registerEmail, registerPassword, registerName, 'Paris', [], false, false);

      if (isAuthResponse(response)) {
        setIsLogged(true);
        // clearing all register fields upon register
        setRegisterEmail('');
        setRegisterName('');
        setRegisterPassword('');
        setConfirmPassword('');
      } else {
        setError('Registration failed: ' + response.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Registration request failed: ' + error.message);
      } else {
        setError('Registration request failed');
      }
    }
  };


  // logout function
  const handleLogout = async () => {
    try {
      await logout();
      setIsLogged(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Logout failed:', error.message);
      } else {
        console.error('Logout failed with an unknown error.');
      }
    }
  };


  const handleCloseError = () => {
    setError('');
  };

  const getHomeElement = () => {
    if (!isLogged) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={2}>
          <Typography variant="h4" color="Blue" gutterBottom>Welcome to Wonderland</Typography>
          {!showRegister ? (
            <>
              {/* Login Fields */}
              <TextField
                margin="normal"
                label="Email"
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
              <TextField
                margin="normal"
                label="Password"
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
              <Button onClick={() => setShowRegister(true)} variant="text" sx={{ mt: 2 }}>Register</Button>
            </>
          ) : (
            <>
              {/* Registetr Fields*/}
              <TextField
                margin="normal"
                label="Name"
                value={registerName}
                onChange={e => setRegisterName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                margin="normal"
                label="Email"
                type="email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                margin="normal"
                label="Password"
                type="password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                margin="normal"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <Button onClick={handleRegister} variant="contained" color="primary" sx={{ mt: 2 }}>Register</Button>
              <Button onClick={() => setShowRegister(false)} variant="text" sx={{ mt: 2 }}>Already Registered?</Button>
            </>
          )
          }
          {/* Error Popup */}
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
        </Box >
      );
    } else {
      return <Navigate to="/dashboard" />;
    }
  };

  const getDashboardElement = () => {
    return isLogged ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getHomeElement()} />
        <Route path="/dashboard" element={getDashboardElement()} />
        <Route path="/form" element={MultistepForm()} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
