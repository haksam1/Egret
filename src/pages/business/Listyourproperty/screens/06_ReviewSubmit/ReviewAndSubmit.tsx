import React from 'react';

interface StepProps {
  data: {
    propertyType?: string;
    listingType?: 'single' | 'multiple';
    amenities?: string[];
    photos?: { id: number; url: string; file?: File }[];
    description?: {
      title: string;
      desc: string;
      highlights: string[];
    };
    houseRules?: { rule: string; allowed: boolean }[];
    pricing?: {
      basePrice: string;
      currency: string;
      discount: string;
      cleaningFee: string;
      cancellationPolicy: string;
    };
    contactInfo?: {
      address: string;
      postalCode: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  onNext: () => void;
  onPrev: () => void;
}

const ReviewAndSubmit: React.FC<StepProps> = ({ data, onNext, onPrev }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📝 Review Your Listing</h2>
        <p className="text-gray-600 text-sm">
          Please go through all the details you've entered before submitting.
        </p>
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">🏡 Property Details</h3>
          <p className="text-sm"><strong>Type:</strong> {data.propertyType || 'N/A'}</p>
          <p className="text-sm"><strong>Listing:</strong> {data.listingType || 'N/A'}</p>
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">🖋️ Description</h3>
          <p className="text-sm"><strong>Title:</strong> {data.description?.title || 'N/A'}</p>
          <p className="text-sm mb-1"><strong>Details:</strong> {data.description?.desc || 'N/A'}</p>
          <p className="text-sm font-semibold mt-2">Highlights:</p>
          <ul className="list-disc list-inside text-sm pl-2 text-gray-700 max-h-24 overflow-y-auto">
            {data.description?.highlights?.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">🔧 Amenities</h3>
          {data.amenities?.length ? (
            <ul className="list-disc list-inside text-sm text-gray-700 max-h-24 overflow-y-auto">
              {data.amenities.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No amenities selected.</p>
          )}
        </div>

        {/* House Rules */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">📋 House Rules</h3>
          {data.houseRules?.length ? (
            <ul className="text-sm text-gray-700 max-h-24 overflow-y-auto space-y-1">
              {data.houseRules.map((rule, i) => (
                <li key={i}>
                  <strong>{rule.rule}</strong>:{' '}
                  <span className={rule.allowed ? 'text-green-600' : 'text-red-600'}>
                    {rule.allowed ? 'Allowed' : 'Not Allowed'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No house rules specified.</p>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">💰 Pricing</h3>
          <p className="text-sm"><strong>Base Price:</strong> {data.pricing?.basePrice || 'N/A'} {data.pricing?.currency}</p>
          <p className="text-sm"><strong>Discount:</strong> {data.pricing?.discount || 'N/A'}</p>
          <p className="text-sm"><strong>Cleaning Fee:</strong> {data.pricing?.cleaningFee || 'N/A'}</p>
          <p className="text-sm"><strong>Cancellation Policy:</strong> {data.pricing?.cancellationPolicy || 'N/A'}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">📞 Contact Info</h3>
          <p className="text-sm"><strong>Address:</strong> {data.contactInfo?.address || 'N/A'}</p>
          <p className="text-sm"><strong>Postal Code:</strong> {data.contactInfo?.postalCode || 'N/A'}</p>
          <p className="text-sm"><strong>Name:</strong> {data.contactInfo?.contactName || 'N/A'}</p>
          <p className="text-sm"><strong>Email:</strong> {data.contactInfo?.contactEmail || 'N/A'}</p>
          <p className="text-sm"><strong>Phone:</strong> {data.contactInfo?.contactPhone || 'N/A'}</p>
        </div>
      </div>

      {/* Photos */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">🖼️ Photos</h3>
        {data.photos?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.photos.map((photo) => (
              <div
                key={photo.id}
                className="w-full h-32 rounded-xl overflow-hidden shadow-md border bg-white"
              >
                <img
                  src={photo.url}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No photos uploaded.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold hover:from-teal-600 hover:to-green-600 transition-all shadow-md"
        >
          Submit Listing →
        </button>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
