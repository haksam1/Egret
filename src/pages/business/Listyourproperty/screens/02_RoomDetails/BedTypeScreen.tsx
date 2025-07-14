import React, { useRef, useEffect, useState } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface BedTypeScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const bedTypes = [
  { 
    id: 'single', 
    name: 'Single Bed', 
    icon: '🛏️', 
    size: '90cm x 190cm', 
    capacity: '1 person',
    color: 'from-blue-400 to-indigo-400',
    description: 'Perfect for solo travelers'
  },
  { 
    id: 'twin', 
    name: 'Twin Bed', 
    icon: '🛏️', 
    size: '90cm x 190cm', 
    capacity: '1 person',
    color: 'from-purple-400 to-pink-400',
    description: 'Standard single bed size'
  },
  { 
    id: 'double', 
    name: 'Double Bed', 
    icon: '🛏️', 
    size: '135cm x 190cm', 
    capacity: '2 people',
    color: 'from-green-400 to-emerald-400',
    description: 'Cozy for couples'
  },
  { 
    id: 'queen', 
    name: 'Queen Bed', 
    icon: '🛌', 
    size: '150cm x 200cm', 
    capacity: '2 people',
    color: 'from-orange-400 to-red-400',
    description: 'Spacious and comfortable'
  },
  { 
    id: 'king', 
    name: 'King Bed', 
    icon: '🛌', 
    size: '180cm x 200cm', 
    capacity: '2 people',
    color: 'from-yellow-400 to-orange-400',
    description: 'Luxury sleeping experience'
  },
  { 
    id: 'bunk', 
    name: 'Bunk Bed', 
    icon: '🏠', 
    size: 'Varies', 
    capacity: '2 people',
    color: 'from-teal-400 to-cyan-400',
    description: 'Space-efficient option'
  },
  { 
    id: 'sofa_bed', 
    name: 'Sofa Bed', 
    icon: '🛋️', 
    size: 'Varies', 
    capacity: '1-2 people',
    color: 'from-pink-400 to-rose-400',
    description: 'Versatile furniture piece'
  },
  { 
    id: 'futon', 
    name: 'Futon', 
    icon: '🛏️', 
    size: 'Varies', 
    capacity: '1-2 people',
    color: 'from-indigo-400 to-purple-400',
    description: 'Japanese-style bedding'
  }
];

const BedTypeScreen: React.FC<BedTypeScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [selectedBedTypes, setSelectedBedTypes] = useState(data.bedType || []);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bedIconRef = useRef<HTMLDivElement>(null);
  const bedsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const guidelinesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(bedIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(bedsRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.2, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(summaryRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(guidelinesRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.9, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 1, ease: 'power2.out' });

    // Floating bed icon animation
    gsap.to(bedIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered animation for bed cards
    if (bedsRef.current) {
      const cards = bedsRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleBedTypeToggle = (bedTypeId: string) => {
    const currentTypes = selectedBedTypes;
    const isSelected = currentTypes.includes(bedTypeId);
    
    const updatedTypes = isSelected
      ? currentTypes.filter(id => id !== bedTypeId)
      : [...currentTypes, bedTypeId];
    
    setSelectedBedTypes(updatedTypes);
    onUpdate({ bedType: updatedTypes });

    // Animate the selected card
    const cardElement = document.querySelector(`[data-bed-id="${bedTypeId}"]`);
    if (cardElement) {
      gsap.to(cardElement, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      gsap.to(cardElement, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.out' });
    }
  };

  const completionPercentage = (selectedBedTypes.length / bedTypes.length) * 100;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={bedIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          🛏️
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          What types of beds do you offer?
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select all bed types available in your property
        </p>
        
        {/* Progress indicator */}
        {/* <div ref={progressRef} className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Selected: {selectedBedTypes.length}/{bedTypes.length}</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div> */}
      </div>

      {/* Beds Grid */}
      <div ref={bedsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {bedTypes.map((bed) => {
          const isSelected = selectedBedTypes.includes(bed.id);
          return (
            <div
              key={bed.id}
              data-bed-id={bed.id}
              onClick={() => handleBedTypeToggle(bed.id)}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected 
                  ? 'ring-4 ring-green-400 ring-opacity-50 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bed.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Card Content */}
              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-green-500 bg-white shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-green-300 hover:bg-white'
              }`}>
                
                {/* Icon */}
                <div className={`text-5xl mb-4 text-center transition-transform duration-300 group-hover:scale-110 ${
                  isSelected ? 'animate-pulse' : ''
                }`}>
                  {bed.icon}
                </div>
                
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                    isSelected ? 'text-green-700' : 'text-gray-800'
                  }`}>
                    {bed.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{bed.size}</p>
                  <p className="text-xs text-gray-500 mb-2">{bed.capacity}</p>
                  <p className="text-xs text-gray-400 italic">{bed.description}</p>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bed.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      {selectedBedTypes.length > 0 && (
        <div ref={summaryRef} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">✅</div>
            <h3 className="font-bold text-green-600 text-lg">Selected Bed Types ({selectedBedTypes.length})</h3>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {selectedBedTypes.map((bedId) => {
              const bed = bedTypes.find(b => b.id === bedId);
              return bed ? (
                <div key={bedId} className="flex flex-col items-center gap-1 p-3 bg-white/60 rounded-lg">
                  <span className="text-lg">{bed.icon}</span>
                  <span className="text-xs font-medium text-gray-700 text-center">{bed.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Guidelines Section */}
      <div ref={guidelinesRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🛏️</div>
          <h3 className="font-bold text-blue-600 text-lg">Bed Guidelines</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Select all bed types available to guests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>You'll specify quantities in the next step</span>
            </li>
          </ul>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Include pull-out beds and sofa beds if available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Consider comfort level and bed quality</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div ref={buttonsRef} className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-8 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={selectedBedTypes.length === 0}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            selectedBedTypes.length > 0
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default BedTypeScreen;
