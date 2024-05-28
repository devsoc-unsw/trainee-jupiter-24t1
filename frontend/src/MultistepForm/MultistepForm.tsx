import React, { useState } from 'react';
import NameStep from './NameStep';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import LocationStep from './LocationStep';
import PreferencesStep from './PreferenceStep';
import { register } from '../apiService';
import VegetarianStep from './VegetarianStep';
import GlutenFreeStep from './GlutenFreeStep';
import { useNavigate } from 'react-router-dom';

const MultistepForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  const navigate = useNavigate();
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const submitForm = () => {
    const formData = { name, email, password, location, preferences, isVegetarian, isGlutenFree };
    console.log('Form Submitted:', formData);
    const preferenceList = preferences.split(" ");
    register(email, password, name, location, preferenceList, isVegetarian, isGlutenFree)
    .then((response) => {
      // Assuming register returns a promise and is successful
      if (response.success) {
        // Navigate to the recommendation page
        navigate('/recommendation');
      } else {
        // Handle registration failure
        console.error('Registration failed:', response.error);
      }
    })
    .catch((error) => {
      // Handle errors from the register function
      console.error('An error occurred during registration:', error);
    });
  };

  const renderStep = (): React.ReactNode => {
    switch (step) {
      case 1:
        return <NameStep name={name} setName={setName} nextStep={nextStep} />;
      case 2:
        return <EmailStep email={email} setEmail={setEmail} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <PasswordStep password={password} setPassword={setPassword} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <LocationStep location={location} setLocation={setLocation} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <PreferencesStep preferences={preferences} setPreferences={setPreferences} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <VegetarianStep isVegetarian={isVegetarian} setVegetarian={setIsVegetarian} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        return <GlutenFreeStep isGlutenFree={isGlutenFree} setIsGlutenFree={setIsGlutenFree} prevStep={prevStep} submitForm={submitForm} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}
    </div>
  );
};

export default MultistepForm;
