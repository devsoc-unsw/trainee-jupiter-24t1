import React from 'react';

interface GlutenFreeStepProps {
  isGlutenFree: boolean;
  setIsGlutenFree: (glutenFree: boolean) => void;
  prevStep: () => void;
  submitForm: () => void;
}

const GlutenFreeStep: React.FC<GlutenFreeStepProps> = ({ isGlutenFree, setIsGlutenFree, prevStep, submitForm }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5">
        <h2 className="text-3xl mb-4 w-full text-left">
          Step 7: Do you require{' '}
          <span className="text-green-400 font-bold">gluten-free</span> meals?
        </h2>
        <div className="flex flex-col w-full mb-4 text-2xl">
          <label className="mb-2">
            <input
              type="radio"
              name="glutenFree"
              value="yes"
              checked={isGlutenFree === true}
              onChange={() => setIsGlutenFree(true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="mb-2">
            <input
              type="radio"
              name="glutenFree"
              value="no"
              checked={isGlutenFree === false}
              onChange={() => setIsGlutenFree(false)}
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
            onClick={submitForm}
            className="bg-green-400 rounded-3xl text-white font-bold text-lg py-2 px-6"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlutenFreeStep;
