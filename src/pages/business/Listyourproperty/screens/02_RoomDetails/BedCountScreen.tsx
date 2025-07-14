import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaBed } from 'react-icons/fa';

interface BedCountScreenProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BedCountScreen: React.FC<BedCountScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

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
    if (inputRef.current) {
      gsap.fromTo(
        inputRef.current,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      onUpdate({ bedCount: value });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-100/60 to-teal-100/60 py-8 px-2">
      <div
        ref={containerRef}
        className="w-full max-w-lg mx-auto glass-card rounded-3xl shadow-2xl p-10 relative backdrop-blur-xl bg-white/70 border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <div ref={iconRef} className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-400 shadow-lg">
            <FaBed className="text-white text-4xl drop-shadow" />
          </span>
        </div>
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-800 tracking-tight">Bed Count</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Enter the number of beds available in this room.
        </p>
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-xl pointer-events-none">
            <FaBed />
          </span>
          <input
            type="number"
            min={0}
            value={data.bedCount || ''}
            onChange={handleChange}
            ref={inputRef}
            className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-xl text-center text-2xl font-semibold focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-300 shadow-sm bg-white/80 placeholder-gray-400 outline-none"
            placeholder="Number of beds"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4" ref={buttonsRef}>
          <button
            onClick={onPrev}
            className="px-8 py-3 text-gray-600 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={data.bedCount === undefined || data.bedCount === null}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              data.bedCount !== undefined && data.bedCount !== null
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

export default BedCountScreen;
