import React, { useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import { InputField } from '../../components/common/InputField';
import { FaRulerCombined } from 'react-icons/fa';
import { gsap } from 'gsap';

interface RoomSizeScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RoomSizeScreen: React.FC<RoomSizeScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );
    }
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotate: -30, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'back.out(1.7)' }
      );
    }
    if (inputWrapperRef.current) {
      gsap.fromTo(
        inputWrapperRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, delay: 0.4, ease: 'power3.out' }
      );
    }
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSizeChange = (roomSize: string) => {
    onUpdate({ roomSize: parseInt(roomSize) || 0 });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-100/60 to-teal-100/60 py-8 px-2">
      <div
        ref={containerRef}
        className="w-full max-w-xl mx-auto glass-card rounded-3xl shadow-2xl p-10 relative backdrop-blur-xl bg-white/70 border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <div ref={iconRef} className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-400 shadow-lg">
            <FaRulerCombined className="text-white text-4xl drop-shadow" />
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-center text-green-700 tracking-tight">What's the size of your room?</h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Provide the room size to help guests understand the space
        </p>
        <div className="relative mb-8" ref={inputWrapperRef}>
          <InputField
            label={<span className="inline-flex items-center gap-2"><FaRulerCombined className="text-green-400" /> Room Size (square meters)</span>}
            value={data.roomSize?.toString() || ''}
            onChange={handleSizeChange}
            placeholder="e.g., 25"
            type="number"
            helperText="Approximate size of the guest room"
            // @ts-ignore
            ref={null}
            // The input is styled via InputField
          />
        </div>
        <div className="bg-green-50 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-green-700 mb-2">📏 Size Reference:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Small room: 10-15 m²</li>
            <li>• Medium room: 15-25 m²</li>
            <li>• Large room: 25-35 m²</li>
            <li>• Very large room: 35+ m²</li>
          </ul>
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
            className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-2xl"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSizeScreen;
