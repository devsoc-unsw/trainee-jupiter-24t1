import React from 'react';
import Button from '@mui/material/Button';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout }) => {
  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleLogoutClick} variant="contained" color="error">Logout</Button>
    </div>
  );
}

export default Dashboard;
