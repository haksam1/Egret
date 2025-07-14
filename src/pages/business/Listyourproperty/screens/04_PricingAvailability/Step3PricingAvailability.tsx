import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3PricingAvailability: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [weekendPrice, setWeekendPrice] = useState(data.weekendPrice || '');
  const [focusedField, setFocusedField] = useState<boolean>(false);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const weekendIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Weekend price suggestions in UGX
  const weekendPriceSuggestions = [100000, 150000, 200000, 250000];

  // Format number as UGX
  const formatUGX = (value: number | string) => `UGX ${Number(value).toLocaleString('en-UG')}`;

  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(weekendIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });
    gsap.to(weekendIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const handleWeekendPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeekendPrice(e.target.value);
    onUpdate({ weekendPrice: Number(e.target.value) });
  };

  const getProgressPercentage = () => {
    return weekendPrice.trim().length > 0 ? 100 : 0;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div ref={weekendIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          🎉
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Weekend Price
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Set a special price for weekends to maximize your earnings
        </p>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-8">
          <div className={`transition-all duration-300 ${focusedField ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="weekendPrice">
              <span className="text-green-600">Weekend Price</span>
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                id="weekendPrice"
                type="number"
                value={weekendPrice}
                onChange={handleWeekendPriceChange}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                placeholder="Enter weekend price"
                min={0}
              />
              <div className="flex gap-2">
                {weekendPriceSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWeekendPrice(String(suggestion));
                      onUpdate({ weekendPrice: suggestion });
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      Number(weekendPrice) === suggestion
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    {formatUGX(suggestion)}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Set a higher price for weekends to increase your revenue
            </p>
          </div>
        </form>
      </div>

      {/* Preview */}
      {weekendPrice && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Preview</h3>
          </div>
          <div className="bg-white/60 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span className="font-bold text-gray-800">Weekend Price:</span>
              <span className="text-green-700">{formatUGX(weekendPrice)}</span>
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

export default Step3PricingAvailability;
