import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getProfile, editProfile, UserProfile } from './apiService';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>({ email: '', name: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', name: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormValues({ email: data.email, name: data.name, password: '' });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setFormValues({ email: '', name: '', password: '' });
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEdit = async () => {
    try {
      const updatedProfile = await editProfile(formValues);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <>
        <Typography variant="body1"><strong>Name:</strong> {profile?.name}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {profile?.email}</Typography>
        <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>Edit</Button>
        <Button variant="outlined" color="secondary" onClick={handleBackToDashboard} style={{ marginLeft: '10px' }}>Dashboard</Button>
      </>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formValues.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={formValues.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
