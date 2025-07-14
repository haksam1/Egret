import React from 'react';
import { PropertyData } from '../../ListOfProperty';

interface PropertyGroupScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const propertyGroups = [
  { id: 'entire_place', name: 'Entire place', icon: '🏠', description: 'Guests have the whole place to themselves' },
  { id: 'private_room', name: 'Private room', icon: '🚪', description: 'Guests have a private room, shared common areas' },
  { id: 'shared_room', name: 'Shared room', icon: '🛏️', description: 'Guests share a room with others' }
];

const PropertyGroupScreen: React.FC<PropertyGroupScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleSelect = (propertyGroup: string) => {
    onUpdate({ propertyGroup });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          What can guests book?
        </h1>
        <p className="text-gray-600">
          Choose what guests will have access to when they stay
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {propertyGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => handleSelect(group.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              data.propertyGroup === group.id
                ? 'border-green-600 bg-green-50 shadow-lg'
                : 'border-gray-200 bg-white/80 hover:border-green-400'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{group.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
            </div>
          </div>
        ))}
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
          disabled={!data.propertyGroup}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.propertyGroup
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

export default PropertyGroupScreen;
