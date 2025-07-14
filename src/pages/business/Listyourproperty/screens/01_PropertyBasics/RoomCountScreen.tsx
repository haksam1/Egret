import React from 'react';
import { PropertyData } from '../../ListOfProperty';

interface RoomCountScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RoomCountScreen: React.FC<RoomCountScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleRoomCountChange = (roomCount: number) => {
    onUpdate({ roomCount });
  };

  const roomOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          How many bedrooms can guests use?
        </h1>
        <p className="text-gray-600">
          Count only the bedrooms that guests will have access to
        </p>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {roomOptions.map((count) => (
            <div
              key={count}
              onClick={() => handleRoomCountChange(count)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg text-center ${
                data.roomCount === count
                  ? 'border-green-600 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-green-400'
              }`}
            >
              <div className="text-3xl font-bold text-gray-800 mb-2">{count}</div>
              <div className="text-sm text-gray-600">
                {count === 1 ? 'Bedroom' : 'Bedrooms'}
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={() => handleRoomCountChange(0)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
            data.roomCount === 0
              ? 'border-green-600 bg-green-50 shadow-lg'
              : 'border-gray-200 bg-white/80 hover:border-green-400'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">Studio</div>
            <div className="text-sm text-gray-600">No separate bedroom</div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 mt-6">
          <h3 className="font-semibold text-green-800 mb-2">🛏️ Bedroom Guidelines:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Only count bedrooms guests can access</li>
            <li>• Include private bedrooms and shared bedrooms</li>
            <li>• Don't count living rooms or common areas</li>
            <li>• Studio = sleeping area is part of the main room</li>
          </ul>
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
          disabled={data.roomCount === undefined}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            data.roomCount !== undefined
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

export default RoomCountScreen;
