import React from 'react';

interface SubmissionSuccessScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<
    | 'home'
    | 'category'
    | 'quantity'
    | 'confirm'
    | 'benefits'
    | 'amenities'
    | 'photos'
    | 'description'
    | 'house-rules'
    | 'pricing'
    | 'review'
    | 'form'
    | 'success'
    | 'submittedProperties'
  >>;
}

const SubmissionSuccessScreen: React.FC<SubmissionSuccessScreenProps> = ({ setScreen }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-100 to-teal-200 p-8">
      <h2 className="text-5xl font-extrabold text-green-700 mb-6">🎉 Submission Successful!</h2>
      <p className="text-lg text-green-800 mb-12 text-center max-w-xl">
        Your property data has been submitted successfully.
      </p>
      <div className="flex gap-6">
        <button
          onClick={() => setScreen('home')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Go Back to Home
        </button>
        <button
          onClick={() => setScreen('submittedProperties')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          View Submitted Properties
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccessScreen;
