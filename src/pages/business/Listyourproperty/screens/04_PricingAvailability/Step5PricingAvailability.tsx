import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step5PricingAvailability: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [securityDeposit, setSecurityDeposit] = useState(data.securityDeposit || '');
  const [focusedField, setFocusedField] = useState(false);

  // Refs for animation
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Format UGX
  const formatUGX = (value: number | string) => `UGX ${Number(value).toLocaleString('en-UG')}`;

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

  const handleSecurityDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityDeposit(e.target.value);
    onUpdate({ securityDeposit: Number(e.target.value) });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          ref={iconRef}
          className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300"
        >
          🛡️
        </div>
        <h1
          ref={titleRef}
          className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
        >
          Security Deposit
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Add a refundable security deposit to protect your property
        </p>
      </div>

      {/* Form Section */}
      <div
        ref={formRef}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20"
      >
        <form className="space-y-8">
          <div className={`transition-all duration-300 ${focusedField ? 'scale-105' : ''}`}>
            <label
              htmlFor="securityDeposit"
              className="block mb-3 font-bold text-gray-800 text-lg"
            >
              <span className="text-green-600">Security Deposit</span>
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </label>
            <input
              id="securityDeposit"
              type="number"
              value={securityDeposit}
              onChange={handleSecurityDepositChange}
              onFocus={() => setFocusedField(true)}
              onBlur={() => setFocusedField(false)}
              className="w-52 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
              placeholder="Enter deposit in UGX"
              min={0}
            />
            <p className="text-sm text-gray-500 mt-2">
              This amount will be held and refunded if no damages occur
            </p>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {securityDeposit && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Preview</h3>
          </div>
          <div className="bg-white/60 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span className="font-bold text-gray-800">Security Deposit:</span>
              <span className="text-green-700">{formatUGX(securityDeposit)}</span>
            </div>
          </div>
        </div>
      )}

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
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step5PricingAvailability;
