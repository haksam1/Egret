import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface SharedSpacesScreenProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const sharedSpacesOptions = [
  { 
    id: 'living_room', 
    name: 'Living Room', 
    description: 'Common area for relaxation and socializing',
    icon: '🛋️',
    color: 'from-purple-400 to-pink-400'
  },
  { 
    id: 'kitchen', 
    name: 'Kitchen', 
    description: 'Shared cooking and dining space',
    icon: '🍳',
    color: 'from-orange-400 to-red-400'
  },
  { 
    id: 'garden', 
    name: 'Garden', 
    description: 'Outdoor green space for guests',
    icon: '🌿',
    color: 'from-green-400 to-emerald-400'
  },
  { 
    id: 'dining_area', 
    name: 'Dining Area', 
    description: 'Shared space for meals',
    icon: '🍽️',
    color: 'from-blue-400 to-indigo-400'
  },
  { 
    id: 'lounge', 
    name: 'Lounge', 
    description: 'Comfortable seating area for guests',
    icon: '🪑',
    color: 'from-teal-400 to-cyan-400'
  }
];

const SharedSpacesScreen: React.FC<SharedSpacesScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [selectedSpaces, setSelectedSpaces] = useState(data.sharedSpaces || []);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const spacesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(spacesRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.2, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(summaryRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 1, ease: 'power2.out' });

    // Staggered animation for space cards
    if (spacesRef.current) {
      const cards = spacesRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleToggle = (id: string) => {
    const current = selectedSpaces;
    let newSelection;
    
    if (current.includes(id)) {
      newSelection = current.filter((space: string) => space !== id);
    } else {
      newSelection = [...current, id];
    }
    
    setSelectedSpaces(newSelection);
    onUpdate({ sharedSpaces: newSelection });

    // Animate the selected card
    const cardElement = document.querySelector(`[data-space-id="${id}"]`);
    if (cardElement) {
      gsap.to(cardElement, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      gsap.to(cardElement, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.out' });
    }
  };

  const completionPercentage = (selectedSpaces.length / sharedSpacesOptions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4 animate-bounce">🏠</div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Shared Spaces
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the shared spaces available to guests in your property.
        </p>
        
        {/* Progress indicator */}
        {/* <div ref={progressRef} className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Selected: {selectedSpaces.length}/{sharedSpacesOptions.length}</span>
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

      {/* Spaces Grid */}
      <div ref={spacesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sharedSpacesOptions.map((space) => {
          const isSelected = selectedSpaces.includes(space.id);
          return (
            <div
              key={space.id}
              data-space-id={space.id}
              onClick={() => handleToggle(space.id)}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected 
                  ? 'ring-4 ring-green-400 ring-opacity-50 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${space.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Card Content */}
              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-green-500 bg-white shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-green-300 hover:bg-white'
              }`}>
                
                {/* Icon */}
                <div className={`text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  isSelected ? 'animate-pulse' : ''
                }`}>
                  {space.icon}
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
                <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                  isSelected ? 'text-green-700' : 'text-gray-800'
                }`}>
                  {space.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {space.description}
                </p>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${space.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div ref={summaryRef} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">📋</div>
          <h3 className="font-bold text-green-600 text-lg">Selected Shared Spaces</h3>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {selectedSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedSpaces.map((spaceId: string) => {
              const space = sharedSpacesOptions.find(s => s.id === spaceId);
              return space ? (
                <div key={spaceId} className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                  <span className="text-lg">{space.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{space.name}</span>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            Select shared spaces above to see your summary
          </div>
        )}
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
          disabled={selectedSpaces.length === 0}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            selectedSpaces.length > 0
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SharedSpacesScreen;
