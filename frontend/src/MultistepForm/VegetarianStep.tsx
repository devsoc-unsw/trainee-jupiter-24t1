import React from 'react';

interface VegetarianStepProps {
  isVegetarian: boolean;
  setVegetarian: (vegetarian: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const VegetarianStep: React.FC<VegetarianStepProps> = ({ isVegetarian, setVegetarian, nextStep, prevStep }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5">
        <h2 className="text-3xl mb-4 w-full text-left">
          Step 6: Are you a{' '}
          <span className="text-green-400 font-bold">vegetarian</span>?
        </h2>
        <div className="flex flex-col w-full mb-4 text-2xl">
          <label className="mb-2">
            <input
              type="radio"
              name="vegetarian"
              value="yes"
              checked={isVegetarian === true}
              onChange={() => setVegetarian(true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="mb-2">
            <input
              type="radio"
              name="vegetarian"
              value="no"
              checked={isVegetarian === false}
              onChange={() => setVegetarian(false)}
              className="mr-2"
            />
            No
          </label>
        </div>
        <div className="flex justify-start">
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

export default VegetarianStep;
