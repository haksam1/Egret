import React from 'react';
import { PropertyData } from '../../ListOfProperty';

interface BathroomCountScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BathroomCountScreen: React.FC<BathroomCountScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleBathroomCountChange = (bathroomCount: number) => {
    onUpdate({ bathroomCount });
  };

  const bathroomOptions = [
    { count: 1, label: '1 Bathroom' },
    { count: 1.5, label: '1.5 Bathrooms' },
    { count: 2, label: '2 Bathrooms' },
    { count: 2.5, label: '2.5 Bathrooms' },
    { count: 3, label: '3 Bathrooms' },
    { count: 3.5, label: '3.5 Bathrooms' },
    { count: 4, label: '4 Bathrooms' },
    { count: 5, label: '5+ Bathrooms' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#4b6cb7] mb-3">
          How many bathrooms can guests use?
        </h1>
        <p className="text-gray-600">
          Include all bathrooms that guests will have access to
        </p>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {bathroomOptions.map((option) => (
            <div
              key={option.count}
              onClick={() => handleBathroomCountChange(option.count)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                data.bathroomCount === option.count
                  ? 'border-green-600 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-green-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {option.count === Math.floor(option.count) ? option.count.toString() : option.count.toString()}
                </div>
                <div className="text-sm text-gray-600">{option.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 mb-2">🚿 Bathroom Guidelines:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Full bathroom:</strong> toilet, sink, shower/bathtub</li>
            <li>• <strong>Half bathroom:</strong> toilet and sink only</li>
            <li>• Count shared bathrooms if guests can access them</li>
            <li>• Include ensuite bathrooms in bedrooms</li>
          </ul>
        </div>

        {data.bathroomCount && (
          <div className="bg-green-50 rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Selected:</h4>
            <p className="text-green-700">
              {data.bathroomCount} {data.bathroomCount === 1 ? 'Bathroom' : 'Bathrooms'}
            </p>
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
          disabled={!data.bathroomCount}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.bathroomCount
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

export default BathroomCountScreen;
