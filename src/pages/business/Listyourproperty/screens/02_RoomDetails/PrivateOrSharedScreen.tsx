import React from 'react';
import { PropertyData } from '../../ListOfProperty';

interface PrivateOrSharedScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const privacyOptions = [
  { 
    id: 'private', 
    name: 'Private Room', 
    icon: '🔐', 
    description: 'Guests have exclusive access to this room',
    features: ['Private entry', 'Lockable door', 'Complete privacy']
  },
  { 
    id: 'shared', 
    name: 'Shared Room', 
    icon: '👥', 
    description: 'Guests share this room with others',
    features: ['Shared with other guests', 'Lower cost option', 'Social environment']
  },
  { 
    id: 'semi_private', 
    name: 'Semi-Private', 
    icon: '🚪', 
    description: 'Private sleeping area within a shared space',
    features: ['Private sleeping space', 'Shared common areas', 'Curtain or partition']
  }
];

const PrivateOrSharedScreen: React.FC<PrivateOrSharedScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleSelect = (privateOrShared: string) => {
    onUpdate({ privateOrShared });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Is this a private or shared room?
        </h1>
        <p className="text-gray-600">
          This helps guests understand what level of privacy to expect
        </p>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 mb-8">
        <div className="space-y-4 mb-6">
          {privacyOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                data.privateOrShared === option.id
                  ? 'border-green-600 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-green-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {option.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{option.description}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Privacy Impact:</h3>
          <p className="text-sm text-yellow-700">
            The privacy level affects guest expectations and pricing. Private rooms typically 
            command higher rates, while shared rooms offer budget-friendly options for social travelers.
          </p>
        </div>
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
          disabled={!data.privateOrShared}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.privateOrShared
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

export default PrivateOrSharedScreen;
