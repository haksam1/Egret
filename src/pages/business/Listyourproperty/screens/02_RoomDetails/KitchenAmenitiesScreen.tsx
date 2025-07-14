import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import { FaSnowflake, FaBlender, FaCoffee, FaUtensils, FaToiletPaper, FaBurn, FaBreadSlice, FaBoxOpen } from 'react-icons/fa';
import { GiCookingPot, GiKitchenKnives } from 'react-icons/gi';
import { MdKitchen } from 'react-icons/md';
import { gsap } from 'gsap';

interface KitchenAmenitiesScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const kitchenAmenitiesOptions = [
  { id: 'fridge', name: 'Refrigerator', icon: <MdKitchen /> },
  { id: 'microwave', name: 'Microwave', icon: <FaBlender /> },
  { id: 'dishwasher', name: 'Dishwasher', icon: <FaUtensils /> },
  { id: 'oven', name: 'Oven', icon: <GiCookingPot /> },
  { id: 'stove', name: 'Stove', icon: <FaBurn /> },
  { id: 'coffee_maker', name: 'Coffee Maker', icon: <FaCoffee /> },
  { id: 'toaster', name: 'Toaster', icon: <FaBreadSlice /> },
  { id: 'kitchenware', name: 'Kitchenware', icon: <GiKitchenKnives /> }
];

const KitchenAmenitiesScreen: React.FC<KitchenAmenitiesScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(data.kitchenAmenities || []);

  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );
    }
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' }
      );
    }
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' }
      );
    }
    if (itemRefs.current.length) {
      gsap.fromTo(
        itemRefs.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  const toggleAmenity = (id: string) => {
    let updated;
    if (selectedAmenities.includes(id)) {
      updated = selectedAmenities.filter((amenity) => amenity !== id);
    } else {
      updated = [...selectedAmenities, id];
    }
    setSelectedAmenities(updated);
    onUpdate({ kitchenAmenities: updated });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-100/60 to-teal-100/60 py-8 px-2">
      <div
        ref={cardRef}
        className="w-full max-w-2xl mx-auto glass-card rounded-3xl shadow-2xl p-10 relative backdrop-blur-xl bg-white/70 border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-green-700 tracking-tight">Select Kitchen Amenities</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Choose the kitchen amenities available in this room.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" ref={gridRef}>
          {kitchenAmenitiesOptions.map((amenity, idx) => (
            <div
              key={amenity.id}
              ref={el => itemRefs.current[idx] = el}
              onClick={() => toggleAmenity(amenity.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm bg-white/80 hover:shadow-lg hover:border-teal-400 ${
                selectedAmenities.includes(amenity.id)
                  ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white/80'
              }`}
              style={{ minHeight: 80 }}
            >
              <span className={`text-3xl ${selectedAmenities.includes(amenity.id) ? 'text-green-500' : 'text-gray-400'}`}>{amenity.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{amenity.name}</h3>
              </div>
              {selectedAmenities.includes(amenity.id) && (
                <span className="inline-block w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-lg shadow">✓</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-4" ref={buttonsRef}>
          <button
            onClick={onPrev}
            className="px-8 py-3 text-gray-600 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={selectedAmenities.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              selectedAmenities.length > 0
                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-2xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenAmenitiesScreen;
