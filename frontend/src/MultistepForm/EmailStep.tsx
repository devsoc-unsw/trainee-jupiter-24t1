import React from 'react';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ email, setEmail, nextStep, prevStep }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 w-2/5">
        <h2 className="text-3xl mb-4 w-full text-left">
          Step 2: What is your{' '}
          <span className="text-green-300 font-bold">primary email address</span>?
        </h2>
        <div className="flex w-full">
          <div className="relative w-full">
            <input
              id="username"
              name="username"
              type="text"
              value={email}
              placeholder='name@example.com'
              dir='Itr'
              onChange={(e) => setEmail(e.target.value)}
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
            className="bg-green-400 rounded-3xl text-white font-bold text-lg py-2 px-6"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;