import React from 'react';
import { PropertyData } from '../../ListOfProperty';

interface PropertyTypeScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const propertyTypes = [
  { id: 'apartment', name: 'Apartment', icon: '🏢', description: 'A private room or entire place in a building' },
  { id: 'house', name: 'House', icon: '🏠', description: 'A standalone house or villa' },
  { id: 'hotel', name: 'Hotel', icon: '🏨', description: 'A commercial accommodation business' },
  { id: 'guesthouse', name: 'Guesthouse', icon: '🏡', description: 'A small accommodation for paying guests' },
  { id: 'hostel', name: 'Hostel', icon: '🛏️', description: 'Budget-friendly shared accommodation' },
  { id: 'resort', name: 'Resort', icon: '🏖️', description: 'Full-service vacation accommodation' }
];

const PropertyTypeScreen: React.FC<PropertyTypeScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleSelect = (propertyType: string) => {
    onUpdate({ propertyType });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          What type of property are you listing?
        </h1>
        <p className="text-gray-600">
          Choose the option that best describes your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {propertyTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              data.propertyType === type.id
                ? 'border-green-600 bg-green-50 shadow-lg'
                : 'border-gray-200 bg-white/80 hover:border-green-400'
            }`}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {type.name}
            </h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
          disabled={true}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!data.propertyType}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.propertyType
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

export default PropertyTypeScreen;
