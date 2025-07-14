import React, { useRef, useEffect, useState } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface RoomTypeScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const roomTypes = [
  { 
    id: 'bedroom', 
    name: 'Bedroom', 
    icon: '🛏️', 
    description: 'Dedicated sleeping room',
    color: 'from-blue-400 to-indigo-400',
    features: ['Private space', 'Dedicated sleeping area', 'Traditional layout']
  },
  { 
    id: 'studio', 
    name: 'Studio', 
    icon: '🏠', 
    description: 'Combined living and sleeping space',
    color: 'from-purple-400 to-pink-400',
    features: ['Open floor plan', 'Multi-functional space', 'Efficient design']
  },
  { 
    id: 'loft', 
    name: 'Loft', 
    icon: '🏢', 
    description: 'Open-plan upper floor space',
    color: 'from-green-400 to-emerald-400',
    features: ['High ceilings', 'Open concept', 'Urban style']
  },
  { 
    id: 'suite', 
    name: 'Suite', 
    icon: '🛎️', 
    description: 'Bedroom with sitting area',
    color: 'from-orange-400 to-red-400',
    features: ['Luxury amenities', 'Separate living area', 'Premium experience']
  },
  { 
    id: 'dormitory', 
    name: 'Dormitory', 
    icon: '🛏️', 
    description: 'Shared sleeping room',
    color: 'from-yellow-400 to-orange-400',
    features: ['Shared space', 'Budget-friendly', 'Social atmosphere']
  },
  { 
    id: 'cabin', 
    name: 'Cabin Room', 
    icon: '🏘️', 
    description: 'Small individual room',
    color: 'from-teal-400 to-cyan-400',
    features: ['Compact design', 'Cozy atmosphere', 'Efficient use of space']
  }
];

const RoomTypeScreen: React.FC<RoomTypeScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [selectedRoomType, setSelectedRoomType] = useState(data.roomType || '');

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const roomIconRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const selectedRoomRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(roomIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(roomsRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(guideRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.9, ease: 'power2.out' });

    // Floating room icon animation
    gsap.to(roomIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered animation for room cards
    if (roomsRef.current) {
      const cards = roomsRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleSelect = (roomType: string) => {
    setSelectedRoomType(roomType);
    onUpdate({ roomType });

    // Animate the selected card
    const cardElement = document.querySelector(`[data-room-id="${roomType}"]`);
    if (cardElement) {
      gsap.to(cardElement, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      gsap.to(cardElement, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.out' });
    }

    // Animate the selected room display
    if (selectedRoomRef.current) {
      gsap.fromTo(selectedRoomRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  };

  const selectedRoom = roomTypes.find(room => room.id === selectedRoomType);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={roomIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          🏠
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          What type of room is this?
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the room type
        </p>
      </div>

      {/* Rooms Grid */}
      <div ref={roomsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roomTypes.map((room) => {
          const isSelected = selectedRoomType === room.id;
          return (
            <div
              key={room.id}
              data-room-id={room.id}
              onClick={() => handleSelect(room.id)}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected 
                  ? 'ring-4 ring-green-400 ring-opacity-50 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${room.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
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
                  {room.icon}
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
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-1">
                    {room.features.map((feature, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${room.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Room Display */}
      {selectedRoom && (
        <div ref={selectedRoomRef} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">{selectedRoom.icon}</div>
            <div>
              <h3 className="font-bold text-green-600 text-xl">{selectedRoom.name}</h3>
              <p className="text-gray-600">{selectedRoom.description}</p>
            </div>
            <div className="ml-auto">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedRoom.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <span className="text-green-500">✓</span>
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Section */}
      <div ref={guideRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🏠</div>
          <h3 className="font-bold text-blue-600 text-lg">Room Type Guide</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-blue-500 text-lg">🛏️</span>
              <div>
                <h4 className="font-semibold text-gray-800">Bedroom</h4>
                <p className="text-sm text-gray-600">Traditional separate sleeping room</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-purple-500 text-lg">🏠</span>
              <div>
                <h4 className="font-semibold text-gray-800">Studio</h4>
                <p className="text-sm text-gray-600">Open space combining living and sleeping</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-green-500 text-lg">🏢</span>
              <div>
                <h4 className="font-semibold text-gray-800">Loft</h4>
                <p className="text-sm text-gray-600">High-ceiling, open upper-level space</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-orange-500 text-lg">🛎️</span>
              <div>
                <h4 className="font-semibold text-gray-800">Suite</h4>
                <p className="text-sm text-gray-600">Bedroom with additional seating/living area</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-yellow-500 text-lg">🛏️</span>
              <div>
                <h4 className="font-semibold text-gray-800">Dormitory</h4>
                <p className="text-sm text-gray-600">Shared sleeping room</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-teal-500 text-lg">🏘️</span>
              <div>
                <h4 className="font-semibold text-gray-800">Cabin Room</h4>
                <p className="text-sm text-gray-600">Small individual room</p>
              </div>
            </div>
          </div>
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
          disabled={!selectedRoomType}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            selectedRoomType
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

export default RoomTypeScreen;
