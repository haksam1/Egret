import React from 'react';
import { PropertyData } from '../../ListOfProperty';
import { InputField } from '../../components/common/InputField';

interface PropertyNameScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PropertyNameScreen: React.FC<PropertyNameScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleNameChange = (propertyName: string) => {
    onUpdate({ propertyName });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#4b6cb7] mb-3">
          What's the name of your property?
        </h1>
        <p className="text-gray-600">
          Choose a name that best represents your property
        </p>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 mb-8">
        <InputField
          label="Property Name"
          value={data.propertyName}
          onChange={handleNameChange}
          placeholder="e.g., Cozy Downtown Apartment"
          required
          helperText="This will be the main title guests see when browsing"
        />

        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-[#4b6cb7] mb-2">💡 Naming Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Keep it descriptive and memorable</li>
            <li>• Mention key features (view, location, style)</li>
            <li>• Avoid special characters or all caps</li>
            <li>• Make it welcoming and inviting</li>
          </ul>
        </div>

        {data.propertyName && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Preview:</h4>
            <div className="text-lg font-semibold text-[#4b6cb7]">
              {data.propertyName}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!data.propertyName?.trim()}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.propertyName?.trim()
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PropertyNameScreen;
