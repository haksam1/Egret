import React, { useState } from 'react';

interface DescriptionStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DescriptionStep3: React.FC<DescriptionStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [featureTitle, setFeatureTitle] = useState(data.featureTitle || '');
  const [featureDescription, setFeatureDescription] = useState(data.descriptionStep3 || '');

  const handleFeatureTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureTitle(e.target.value);
    onUpdate({ featureTitle: e.target.value });
  };

  const handleFeatureDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeatureDescription(e.target.value);
    onUpdate({ descriptionStep3: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Description Step 3</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="featureTitle">Feature Title</label>
          <input
            id="featureTitle"
            type="text"
            value={featureTitle}
            onChange={handleFeatureTitleChange}
            className="w-full border rounded p-2"
            placeholder="Enter a title for this feature"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="featureDescription">Feature Description</label>
          <textarea
            id="featureDescription"
            value={featureDescription}
            onChange={handleFeatureDescriptionChange}
            className="w-full border rounded p-2 resize-none"
            rows={6}
            placeholder="Describe this feature in detail"
          />
        </div>
      </form>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DescriptionStep3;
