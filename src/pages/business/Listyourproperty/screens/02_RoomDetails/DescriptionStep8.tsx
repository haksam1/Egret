import React, { useState } from 'react';

interface DescriptionStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DescriptionStep8: React.FC<DescriptionStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [description, setDescription] = useState(data.descriptionStep8 || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onUpdate({ descriptionStep8: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Description Step 8</h2>
      <p className="text-center text-gray-600 mb-6">
        Provide a detailed description for this step to help guests understand your property better.
      </p>
      <textarea
        className="w-full border rounded p-3 resize-none"
        rows={6}
        placeholder="Enter description here..."
        value={description}
        onChange={handleChange}
      />
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DescriptionStep8;
