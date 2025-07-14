import React, { useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface MapLocationConfirmScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MapLocationConfirmScreen: React.FC<MapLocationConfirmScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const locationInfoRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  const tipsListRef = useRef<HTMLUListElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(mapContainerRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.3, ease: 'power2.out' });
    gsap.fromTo(locationInfoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
    gsap.fromTo(tipsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power2.out' });

    // Floating pin animation
    gsap.to(pinRef.current, { y: -10, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered tips animation
    if (tipsListRef.current) {
      const tips = tipsListRef.current.children;
      gsap.fromTo(tips, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.8, ease: 'power2.out' });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 ref={titleRef} className="text-3xl font-bold text-[#4b6cb7] mb-3">
          Confirm your property location
        </h1>
        <p ref={subtitleRef} className="text-gray-600">
          Is the pin in the right location? You can drag it to adjust.
        </p>
      </div>

      <div ref={mapContainerRef} className="bg-white/60 rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Map placeholder */}
        <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-12 right-4 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <div className="text-center relative z-10">
            <div ref={pinRef} className="text-6xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-200">📍</div>
            <h3 className="text-xl font-semibold text-[#4b6cb7] mb-2">Interactive Map</h3>
            <p className="text-gray-600">Map integration would go here</p>
            {data.location && (
              <div ref={locationInfoRef} className="mt-4 text-sm text-gray-700 bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                <p className="font-medium">{data.location.city}, {data.location.state}</p>
                <p>{data.location.country} {data.location.zipCode}</p>
              </div>
            )}
          </div>
        </div>

        <div ref={tipsRef} className="bg-blue-50 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-[#4b6cb7] mb-2 flex items-center gap-2">
            <span className="text-lg">📍</span>
            Location Tips:
          </h3>
          <ul ref={tipsListRef} className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Drag the pin to your exact location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Accurate location helps guests find you easily</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Check that nearby landmarks are visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Your exact address stays private until booking</span>
            </li>
          </ul>
        </div>
      </div>

      <div ref={buttonsRef} className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default MapLocationConfirmScreen;
