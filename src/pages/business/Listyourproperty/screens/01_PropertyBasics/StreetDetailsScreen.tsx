import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import { InputField } from '../../components/common/InputField';
import gsap from 'gsap';

interface StreetDetailsScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StreetDetailsScreen: React.FC<StreetDetailsScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [streetDetails, setStreetDetails] = useState(data.streetDetails || {
    streetAddress: '',
    apartmentNumber: '',
    landmark: '',
    accessInstructions: ''
  });

  // GSAP refs
  const formRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { opacity: 0, x: 40, backgroundColor: '#bbf7d0' },
        { opacity: 1, x: 0, backgroundColor: '#bbf7d0', duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [streetDetails.streetAddress, streetDetails.apartmentNumber, streetDetails.landmark]);

  const handleChange = (field: string, value: string) => {
    const updated = { ...streetDetails, [field]: value };
    setStreetDetails(updated);
    onUpdate({ streetDetails: updated });
  };

  const isFormValid = streetDetails.streetAddress.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-3">
          What's your street address?
        </h1>
        <p className="text-green-600">
          Provide the exact address to help guests find your property
        </p>
      </div>

      <div ref={formRef} className="bg-white/60 rounded-2xl p-6 mb-8 shadow-lg">
        <InputField
          label="Street Address"
          value={streetDetails.streetAddress}
          onChange={(value) => handleChange('streetAddress', value)}
          placeholder="e.g., 123 Main Street"
          required
          helperText="Include house number and street name"
          labelClassName="text-green-700"
        />

        <InputField
          label="Apartment/Unit Number"
          value={streetDetails.apartmentNumber}
          onChange={(value) => handleChange('apartmentNumber', value)}
          placeholder="e.g., Apt 4B, Unit 2"
          helperText="Leave blank if not applicable"
          labelClassName="text-green-700"
        />

        <InputField
          label="Nearby Landmark"
          value={streetDetails.landmark}
          onChange={(value) => handleChange('landmark', value)}
          placeholder="e.g., Next to Central Park"
          helperText="Help guests identify your location easily"
          labelClassName="text-green-700"
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Access Instructions
          </label>
          <textarea
            value={streetDetails.accessInstructions}
            onChange={(e) => handleChange('accessInstructions', e.target.value)}
            placeholder="Any special instructions for finding or accessing your property..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 bg-white/80 h-24 resize-none"
          />
          <p className="text-sm text-green-600 mt-1">
            Optional: Special entry codes, parking info, etc.
          </p>
        </div>

        <div ref={previewRef} className="bg-green-100 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 mb-2">🏠 Address Preview:</h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{streetDetails.streetAddress || 'Street address'}</p>
            {streetDetails.apartmentNumber && <p>{streetDetails.apartmentNumber}</p>}
            {data.location && (
              <p>{data.location.city}, {data.location.state} {data.location.zipCode}</p>
            )}
            {streetDetails.landmark && <p className="text-green-600 mt-1">Near: {streetDetails.landmark}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 focus:scale-105"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:scale-105 ${
            isFormValid
              ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StreetDetailsScreen;
