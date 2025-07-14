import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step6PricingAvailability: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [cancellationPolicy, setCancellationPolicy] = useState(data.cancellationPolicy || '');
  const [focusedField, setFocusedField] = useState(false);

  // Refs for animation
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
    gsap.fromTo(iconRef.current, { opacity: 0, scale: 0, rotation: -180 }, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      delay: 0.3,
      ease: 'back.out(1.7)'
    });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power2.out'
    });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.7,
      ease: 'power2.out'
    });
    gsap.to(iconRef.current, {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  const handleCancellationPolicyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCancellationPolicy(e.target.value);
    onUpdate({ cancellationPolicy: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          ref={iconRef}
          className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300"
          aria-label="Cancellation policy icon"
        >
          📄
        </div>
        <h1
          ref={titleRef}
          className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
        >
          Cancellation Policy
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Define the terms guests must agree to when canceling a booking
        </p>
      </div>

      {/* Form Section */}
      <div
        ref={formRef}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20 transition-transform duration-300 ${
          focusedField ? 'scale-105' : ''
        }`}
      >
        <form className="space-y-8">
          <label
            htmlFor="cancellationPolicy"
            className="block mb-3 font-bold text-gray-800 text-lg"
          >
            Cancellation Policy <span className="text-gray-400 text-sm ml-2">(Optional)</span>
          </label>
          <textarea
            id="cancellationPolicy"
            value={cancellationPolicy}
            onChange={handleCancellationPolicyChange}
            onFocus={() => setFocusedField(true)}
            onBlur={() => setFocusedField(false)}
            rows={6}
            placeholder="Enter cancellation policy details"
            className="w-full border-2 border-gray-200 rounded-xl p-4 resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
          />
        </form>
      </div>

      {/* Buttons */}
      <div
        ref={buttonsRef}
        className="flex justify-between items-center"
      >
        <button
          onClick={onPrev}
          className="px-8 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
          type="button"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
          type="button"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step6PricingAvailability;
