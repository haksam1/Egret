import React, { useEffect, useState, useRef } from 'react';
import { FaTrashAlt, FaHome, FaEye } from 'react-icons/fa';
import { apiService } from '../../../../services/apiService';
import { gsap } from 'gsap'; // Optional: Remove if not used
import PropertyDetailsScreen from './PropertyDetailsScreen';

interface Property {
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
}

interface ApiResponse {
  status: number;
  message: string;
  data: any;
}

interface SubmittedPropertiesScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}

const SubmittedPropertiesScreen: React.FC<SubmittedPropertiesScreenProps> = ({ setScreen }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const cardsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    fetchSubmittedProperties();
  }, []);

  const fetchSubmittedProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sendPostToServerWithOutToken } = apiService();
      const response: ApiResponse = await sendPostToServerWithOutToken('businesses/getproperties', {});

      if (response.status === 200 && Array.isArray(response.data)) {
        const mappedProperties: Property[] = response.data.map((item: any) => ({
          id: item.id,
          propertyName: item.propertyName || 'Untitled Property',
          propertyType: item.propertyType,
          location: item.location || {},
          streetDetails: item.streetDetails || {},
          contactName: item.contactName || '',
          contactEmail: item.contactEmail || '',
          contactPhone: item.contactPhone || '',
          roomCount: item.roomCount,
          bathroomCount: item.bathroomCount,
          basePrice: item.basePrice,
          currency: item.currency,
          discount: item.discount,
          cleaningFee: item.cleaningFee,
          cancellationPolicy: item.cancellationPolicy,
          highlights: item.highlights || [],
          preferredLanguage: item.preferredLanguage,
          createdOn: item.createdOn,
          photos: item.photos || []
        }));
        setProperties(mappedProperties);
      } else {
        throw new Error(response?.message || 'Invalid response format');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      const { sendPostToServerWithOutToken } = apiService();
      const response: ApiResponse = await sendPostToServerWithOutToken('businesses/deleteproperty', { id });

      if (response.status === 200) {
        setProperties(prev => prev.filter(property => property.id !== id));
      } else {
        alert(response.message || 'Failed to delete property');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete property');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

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

  const PropertyImage = ({ property }: { property: Property }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = property.photos?.[0]?.url 
      ? ensureAbsoluteUrl(property.photos[0].url)
      : null;

    if (!imageUrl || imageError) {
      return (
        <div className="h-48 sm:h-40 md:h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No image available</span>
        </div>
      );
    }

    return (
      <div className="h-48 sm:h-40 md:h-48 overflow-hidden bg-gray-100 relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={`${property.propertyName} - ${property.propertyType}`}
          className={`w-full h-full object-cover ${imageLoaded ? 'visible' : 'invisible'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  };

  const ConfirmDeleteModal = ({ propertyId }: { propertyId: number | null }) => {
    if (propertyId === null) return null;
    const property = properties.find(p => p.id === propertyId);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Property</h2>
          <p className="mb-6 text-gray-700">Are you sure you want to delete this property{property ? `: "${property.propertyName}"` : ''}?</p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2"
              onClick={() => setConfirmDeleteId(null)}
              disabled={deletingId === propertyId}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded text-white transition-colors flex items-center gap-2 ${
                deletingId === propertyId
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={() => handleDelete(propertyId)}
              disabled={deletingId === propertyId}
            >
              <FaTrashAlt />
              {deletingId === propertyId ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleViewProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleBackFromDetails = () => {
    setSelectedPropertyId(null);
  };

  if (selectedPropertyId !== null) {
    const selectedProperty = properties.find(p => p.id === selectedPropertyId);
    if (selectedProperty) {
      return (
        <PropertyDetailsScreen 
          property={selectedProperty}
          onBack={handleBackFromDetails} 
        />
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Error Loading Properties</h2>
        <p className="text-red-500 mb-4 md:mb-6">{error}</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>Try Again</span>
          </button>
          <button
            onClick={() => setScreen('home')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FaHome />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <ConfirmDeleteModal propertyId={confirmDeleteId} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Properties</h1>
        <button
          onClick={() => setScreen('home')}
          className="px-4 md:px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto text-center flex items-center justify-center gap-2"
        >
          <FaHome />
          <span>Back to Home</span>
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {properties.map((property, index) => (
            <div
              key={property.id}
              ref={el => cardsRef.current[index] = el as HTMLLIElement}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <PropertyImage property={property} />
              <div className="p-4 md:p-5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                    {property.propertyName}
                  </h3>
                  <span className="bg-gradient-to-r from-green-100 to-teal-100 text-teal-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                    {property.propertyType}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {[property.streetDetails?.street, property.location?.city, property.location?.country]
                    .filter(Boolean).join(', ')}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <span className="text-gray-500 text-xs">Rooms</span>
                    <p className="font-medium text-sm">{property.roomCount || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Bathrooms</span>
                    <p className="font-medium text-sm">{property.bathroomCount || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Price</span>
                    <p className="font-medium text-sm">
                      {property.basePrice ? `${property.currency} ${property.basePrice}` : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Discount</span>
                    <p className="font-medium text-sm">{property.discount || 0}%</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="text-xs font-semibold text-gray-600 mb-1">Contact Info</h4>
                  <p className="text-gray-500 text-xs line-clamp-1">{property.contactName}</p>
                  <p className="text-teal-600 text-xs line-clamp-1">{property.contactEmail}</p>
                  <p className="text-gray-500 text-xs line-clamp-1">{property.contactPhone}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                  <button
                    onClick={() => handleViewProperty(property.id)}
                    className="flex-1 min-w-[120px] py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </button>
                  <div className="relative group">
                    <button
                      onClick={() => setConfirmDeleteId(property.id)}
                      className={`p-2 rounded-full transition-all ${
                        deletingId === property.id
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                      }`}
                      disabled={deletingId === property.id}
                      aria-label="Delete property"
                    >
                      <FaTrashAlt className="text-white text-sm" />
                    </button>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Delete Property
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmittedPropertiesScreen;
