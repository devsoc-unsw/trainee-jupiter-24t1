import React from 'react';

interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ password, setPassword, nextStep, prevStep }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5">
        <h2 className="text-3xl mb-4 w-full text-left">
          Step 3: What is your{' '}
          <span className="text-green-300 font-bold">password</span> for registration?
        </h2>
        <div className="flex w-full">
          <div className="relative w-full">
            <input
              id="username"
              name="username"
              type="text"
              value={password}
              placeholder='Type your password here...'
              dir='Itr'
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 text-5xl py-1 h-20 focus:border-b-2 focus:border-green-400 transition-colors focus:outline-none peer bg-inherit"
            />
          </div>
        </div>
        <div className="flex justify-start mt-4">
          <button
            onClick={prevStep}
            className="bg-gray-500 rounded-3xl text-white font-bold text-lg py-2 px-6 mr-4"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="relative py-2 px-8 border-2 border-green-400 text-black text-lg font-bold nded-full overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordStep;
