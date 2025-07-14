import React from 'react';

interface PropertyDetailsProps {
  property: {
    id: number;
    propertyName: string;
    propertyType: string;
    location: {
      city?: string;
      country?: string;
    };
    streetDetails: {
      street?: string;
    };
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    roomCount?: number;
    bathroomCount?: number;
    basePrice?: number;
    currency?: string;
    discount?: number;
    cleaningFee?: number;
    cancellationPolicy?: string;
    highlights?: string[];
    preferredLanguage?: string;
    createdOn?: string;
    photos?: Array<{ url?: string }>;
  };
  onBack: () => void;
}

const PropertyDetailsScreen: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return getFallbackImageUrl();
    if (url.startsWith('data:')) return url; // Return base64 strings directly
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${window.location.origin}${url}`;
    if (url.startsWith('./')) return `${window.location.origin}/${url.substring(2)}`;
    return `${window.location.origin}/${url}`;
  };

  const getFallbackImageUrl = () => {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded hover:scale-105 transform transition"
      >
        Back to Properties
      </button>
      <h1 className="text-4xl font-bold mb-4">{property.propertyName}</h1>
      {property.photos && property.photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {property.photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={ensureAbsoluteUrl(photo.url || '')}
                alt={`${property.propertyName} photo ${index + 1}`}
                className="w-full h-48 object-cover rounded shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImageUrl();
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">No photos available.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Property Information</h2>
          <div className="space-y-3">
            <p className="text-lg"><strong>Type:</strong> {property.propertyType}</p>
            <p className="text-lg">
              <strong>Location:</strong> {[property.streetDetails?.street, property.location?.city, property.location?.country].filter(Boolean).join(', ')}
            </p>
            <p className="text-lg"><strong>Rooms:</strong> {property.roomCount || '-'}</p>
            <p className="text-lg"><strong>Bathrooms:</strong> {property.bathroomCount || '-'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Pricing Information</h2>
          <div className="space-y-3">
            <p className="text-lg"><strong>Base Price:</strong> {property.basePrice ? `${property.currency} ${property.basePrice}` : '-'}</p>
            <p className="text-lg"><strong>Discount:</strong> {property.discount || 0}%</p>
            <p className="text-lg"><strong>Cleaning Fee:</strong> {property.cleaningFee || '-'}</p>
            <p className="text-lg"><strong>Cancellation Policy:</strong> {property.cancellationPolicy || '-'}</p>
          </div>
        </div>
      </div>
      
      {property.highlights && property.highlights.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Highlights</h2>
          <ul className="list-disc list-inside space-y-2">
            {property.highlights.map((highlight, index) => (
              <li key={index} className="text-gray-700">{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Contact Name</p>
            <p className="font-medium">{property.contactName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-teal-600">{property.contactEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{property.contactPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsScreen;
