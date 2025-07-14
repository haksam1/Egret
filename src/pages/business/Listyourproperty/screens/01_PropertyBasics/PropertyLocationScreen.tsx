import React, { useState, useEffect, useRef } from 'react';
import { PropertyData } from '../../ListOfProperty';
import { InputField } from '../../components/common/InputField';
import { SelectDropdownWithFlags } from '../../components/common/SelectDropdownWithFlags';
import { useCountriesAndCities } from '../../../../../hooks/useCountriesAndCities';

interface PropertyLocationScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your actual Google API key

const loadGoogleMapsScript = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  const existingScript = document.getElementById('googleMaps');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.id = 'googleMaps';
    document.body.appendChild(script);
    script.onload = () => {
      callback();
    };
  } else {
    existingScript.onload = () => {
      callback();
    };
  }
};

const reverseGeocode = async (lat: number, lon: number) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch location');
  return res.json();
};

const PropertyLocationScreen: React.FC<PropertyLocationScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [location, setLocation] = useState(data.location || {
    country: '',
    city: ''
  });
  const [detecting, setDetecting] = useState(false);

  const { countries, cities, loadingCountries, loadingCities, error, fetchCities } = useCountriesAndCities();
  const cityInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!window.google) {
        console.error('Google Maps script not loaded');
        return;
      }
      const service = new window.google.maps.places.AutocompleteService();

      // Static country list example (can be replaced with a more complete list or external source)
      if (countries.length === 0) {
        // fallback to static countries if hook returns empty
        const staticCountries = [
          { value: 'US', label: 'United States', flag: 'https://flagcdn.com/us.svg' },
          { value: 'CA', label: 'Canada', flag: 'https://flagcdn.com/ca.svg' },
          { value: 'GB', label: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg' },
          { value: 'FR', label: 'France', flag: 'https://flagcdn.com/fr.svg' },
          { value: 'DE', label: 'Germany', flag: 'https://flagcdn.com/de.svg' },
        ];
        onUpdate({ location: { ...location, country: staticCountries[0].value } });
      }
    });
  }, [countries]);

  useEffect(() => {
    if (!window.google || !cityInputRef.current) return;

    if (autocompleteRef.current) {
      autocompleteRef.current.unbindAll();
      autocompleteRef.current = null;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(cityInputRef.current, {
      types: ['(cities)'],
      componentRestrictions: location.country ? { country: location.country.toLowerCase() } : undefined,
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.address_components) {
        const cityComponent = place.address_components.find((comp: any) =>
          comp.types.includes('locality') || comp.types.includes('postal_town')
        );
        if (cityComponent) {
          const cityName = cityComponent.long_name;
          const updatedLocation = { ...location, city: cityName };
          setLocation(updatedLocation);
          onUpdate({ location: updatedLocation });
        }
      }
    });
  }, [location.country]);

  useEffect(() => {
    if (location.country) {
      fetchCities(location.country);
    }
  }, [location.country, fetchCities]);

  // Auto-select first city when country changes and cities are loaded
  useEffect(() => {
    if (location.country && cities && cities.length > 0) {
      if (location.city !== cities[0].name) {
        const updatedLocation = { ...location, city: cities[0].name };
        setLocation(updatedLocation);
        onUpdate({ location: updatedLocation });
      }
    }
  }, [location.country, cities]);

  // Geolocation handler
  const handleDetectLocation = async () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const data = await reverseGeocode(latitude, longitude);
        // Try to match country code with your countries list
        let countryCode = '';
        if (data.address && data.address.country_code) {
          countryCode = data.address.country_code.toUpperCase();
        }
        let city = data.address.city || data.address.town || data.address.village || '';
        // If country is found in your list, set it
        if (countryCode && countries.some(c => c.code === countryCode)) {
          const updatedLocation = { country: countryCode, city };
          setLocation(updatedLocation);
          onUpdate({ location: updatedLocation });
          fetchCities(countryCode);
        } else {
          alert('Could not detect a supported country');
        }
      } catch (e) {
        alert('Failed to detect location');
      }
      setDetecting(false);
    }, () => {
      alert('Unable to retrieve your location');
      setDetecting(false);
    });
  };

  const handleLocationChange = (field: string, value: string) => {
    const updatedLocation = { ...location, [field]: value };
    setLocation(updatedLocation);
    onUpdate({ location: updatedLocation });
  };

  const isFormValid = location.country && location.city;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#4b6cb7] mb-3">
          Where is your property located?
        </h1>
        <p className="text-gray-600">
          Help guests find your property easily
        </p>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className={`mt-4 px-4 py-2 rounded font-semibold transition-all duration-300 transform 
            bg-gradient-to-r from-green-500 to-teal-600 text-white 
            ${detecting ? 'scale-95 opacity-80 cursor-wait' : 'hover:scale-105 hover:shadow-lg'}`}
        >
          {detecting ? 'Detecting...' : 'Detect My Location'}
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectDropdownWithFlags
            label="Country"
            value={location.country}
            onChange={(value) => handleLocationChange('country', value)}
          options={countries.map(country => ({
            value: country.code,
            label: country.name,
            flag: `https://flagcdn.com/${country.code.toLowerCase()}.svg`
          }))}
            placeholder="Select country"
            required
          />

          <InputField
            label="City"
            value={location.city}
            onChange={(value) => handleLocationChange('city', value)}
            placeholder="Start typing city"
            required
            ref={cityInputRef}
          />
        </div>

        {loadingCountries && <p>Loading countries...</p>}
        {loadingCities && <p>Loading cities...</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="bg-yellow-50 rounded-xl p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">🔒 Privacy Notice:</h3>
          <p className="text-sm text-yellow-700">
            Your exact address will only be shared with confirmed guests after booking. 
            Only the general area will be shown to potential guests.
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
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isFormValid
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

export default PropertyLocationScreen;
