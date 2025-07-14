import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2PricingAvailability: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [minimumStay, setMinimumStay] = useState(data.minimumStay || '');
  const [maximumStay, setMaximumStay] = useState(data.maximumStay || '');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const calendarIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Suggestions
  const minStaySuggestions = [1, 2, 3, 7];
  const maxStaySuggestions = [7, 14, 30, 90];

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(calendarIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });
    // Floating calendar icon animation
    gsap.to(calendarIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const handleMinimumStayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinimumStay(e.target.value);
    onUpdate({ minimumStay: e.target.value });
  };

  const handleMaximumStayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaximumStay(e.target.value);
    onUpdate({ maximumStay: e.target.value });
  };

  const getProgressPercentage = () => {
    const totalFields = 2;
    const completedFields = [minimumStay, maximumStay].filter(field => String(field).trim().length > 0).length;
    return (completedFields / totalFields) * 100;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={calendarIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          📅
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Minimum & Maximum Stay
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Set the minimum and maximum number of nights guests can book
        </p>
      </div>

      {/* Main Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-8">
          {/* Minimum Stay Field */}
          <div className={`transition-all duration-300 ${focusedField === 'minimumStay' ? 'scale-105' : ''}`}> 
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="minimumStay">
              <span className="text-green-600">Minimum Stay (nights)</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                id="minimumStay"
                type="number"
                value={minimumStay}
                onChange={handleMinimumStayChange}
                onFocus={() => setFocusedField('minimumStay')}
                onBlur={() => setFocusedField(null)}
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                placeholder="Enter minimum stay"
                min={1}
              />
              <div className="flex gap-2">
                {minStaySuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setMinimumStay(String(suggestion)); onUpdate({ minimumStay: suggestion }); }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      Number(minimumStay) === suggestion
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    {suggestion} night{suggestion > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Set the minimum number of nights guests must book
            </p>
          </div>

          {/* Maximum Stay Field */}
          <div className={`transition-all duration-300 ${focusedField === 'maximumStay' ? 'scale-105' : ''}`}> 
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="maximumStay">
              <span className="text-green-600">Maximum Stay (nights)</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                id="maximumStay"
                type="number"
                value={maximumStay}
                onChange={handleMaximumStayChange}
                onFocus={() => setFocusedField('maximumStay')}
                onBlur={() => setFocusedField(null)}
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                placeholder="Enter maximum stay"
                min={1}
              />
              <div className="flex gap-2">
                {maxStaySuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setMaximumStay(String(suggestion)); onUpdate({ maximumStay: suggestion }); }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      Number(maximumStay) === suggestion
                        ? 'bg-teal-100 border-teal-400 text-teal-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-teal-300'
                    }`}
                  >
                    {suggestion} night{suggestion > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Set the maximum number of nights guests can book
            </p>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {(minimumStay || maximumStay) && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Preview</h3>
          </div>
          <div className="bg-white/60 rounded-xl p-6 flex flex-col gap-4">
            {minimumStay && (
              <div className="flex items-center gap-2">
                <span className="text-lg">🔢</span>
                <span className="font-bold text-gray-800">Minimum Stay:</span>
                <span className="text-green-700">{minimumStay} night{Number(minimumStay) > 1 ? 's' : ''}</span>
              </div>
            )}
            {maximumStay && (
              <div className="flex items-center gap-2">
                <span className="text-lg">🔢</span>
                <span className="font-bold text-gray-800">Maximum Stay:</span>
                <span className="text-teal-700">{maximumStay} night{Number(maximumStay) > 1 ? 's' : ''}</span>
              </div>
            )}
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
          disabled={!minimumStay || !maximumStay}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            minimumStay && maximumStay
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

export default Step2PricingAvailability;
