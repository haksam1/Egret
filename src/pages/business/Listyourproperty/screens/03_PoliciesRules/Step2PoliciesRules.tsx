import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PropertyData } from '../../ListOfProperty';

interface StepProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2PoliciesRules: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const clockIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Time suggestions
  const checkInSuggestions = ['14:00', '15:00', '16:00'];
  const checkOutSuggestions = ['10:00', '11:00', '12:00'];

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(clockIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(suggestionsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating clock icon animation
    gsap.to(clockIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const getProgressPercentage = () => {
    const totalFields = 2;
    const completedFields = [checkInTime, checkOutTime].filter(field => field.trim().length > 0).length;
    return (completedFields / totalFields) * 100;
  };

  const writingTips = [
    { icon: '⏰', tip: 'Set realistic check-in and check-out times for cleaning and guest comfort.' },
    { icon: '🤝', tip: 'Communicate flexibility if possible, but be clear about your policy.' },
    { icon: '📝', tip: 'Mention if early check-in or late check-out is available upon request.' },
    { icon: '💡', tip: 'Align times with local travel and transport schedules.' }
  ];

  const handleNext = () => {
    // Save check-in/check-out times to propertyData before proceeding
    const timeRules = [];
    if (checkInTime) {
      timeRules.push({ rule: `Check-in time: ${checkInTime}`, allowed: true });
    }
    if (checkOutTime) {
      timeRules.push({ rule: `Check-out time: ${checkOutTime}`, allowed: true });
    }
    
    // Merge with existing house rules
    const existingRules = Array.isArray(data.houseRules) ? data.houseRules : [];
    onUpdate({ 
      houseRules: [...existingRules, ...timeRules]
    });
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={clockIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          ⏰
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Check-In & Check-Out Times
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Specify when guests can arrive and when they should depart
        </p>
      </div>


      {/* Main Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-8">
          {/* Check-In Time Field */}
          <div className={`transition-all duration-300 ${focusedField === 'checkIn' ? 'scale-105' : ''}`}> 
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="checkInTime">
              <span className="text-green-600">Check-In Time</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                id="checkInTime"
                type="time"
                value={checkInTime}
                onChange={e => setCheckInTime(e.target.value)}
                onFocus={() => setFocusedField('checkIn')}
                onBlur={() => setFocusedField(null)}
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                placeholder="--:--"
              />
              <div className="flex gap-2">
                {checkInSuggestions.map((time, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCheckInTime(time)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      checkInTime === time
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-green-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Typical check-in times: 14:00, 15:00, 16:00
            </p>
          </div>

          {/* Check-Out Time Field */}
          <div className={`transition-all duration-300 ${focusedField === 'checkOut' ? 'scale-105' : ''}`}> 
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="checkOutTime">
              <span className="text-green-600">Check-Out Time</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                id="checkOutTime"
                type="time"
                value={checkOutTime}
                onChange={e => setCheckOutTime(e.target.value)}
                onFocus={() => setFocusedField('checkOut')}
                onBlur={() => setFocusedField(null)}
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                placeholder="--:--"
              />
              <div className="flex gap-2">
                {checkOutSuggestions.map((time, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCheckOutTime(time)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      checkOutTime === time
                        ? 'bg-teal-100 border-teal-400 text-teal-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-teal-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Typical check-out times: 10:00, 11:00, 12:00
            </p>
          </div>
        </form>
      </div>

      {/* Writing Tips */}
      <div ref={suggestionsRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-blue-600 text-lg">Tips for Setting Times</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {writingTips.map((tip, index) => (
            <div key={index} className="bg-white/60 rounded-xl p-4 hover:bg-white hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-xl">{tip.icon}</div>
                <p className="text-sm text-gray-700">{tip.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      {(checkInTime || checkOutTime) && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Preview</h3>
          </div>
          
          <div className="bg-white/60 rounded-xl p-6">
            {checkInTime && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">🟢</span>
                <span className="font-bold text-gray-800">Check-In Time:</span>
                <span className="text-gray-700">{checkInTime}</span>
              </div>
            )}
            {checkOutTime && (
              <div className="flex items-center gap-2">
                <span className="text-lg">🔵</span>
                <span className="font-bold text-gray-800">Check-Out Time:</span>
                <span className="text-gray-700">{checkOutTime}</span>
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
          onClick={handleNext}
          disabled={!checkInTime.trim() || !checkOutTime.trim()}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            checkInTime.trim() && checkOutTime.trim()
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

export default Step2PoliciesRules;
