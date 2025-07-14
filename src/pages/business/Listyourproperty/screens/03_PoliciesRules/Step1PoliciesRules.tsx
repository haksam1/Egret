import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PropertyData } from '../../ListOfProperty';

interface StepProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step1PoliciesRules: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [houseRules, setHouseRules] = useState(data.houseRules?.toString() || '');
  const [focusedField, setFocusedField] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rulesIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Character limit
  const RULES_LIMIT = 1000;

  // Common house rules suggestions
  const ruleSuggestions = [
    { 
      id: 'no-smoking', 
      text: 'No smoking inside the property', 
      icon: '🚭',
      category: 'Smoking'
    },
    { 
      id: 'no-parties', 
      text: 'No parties or large gatherings', 
      icon: '🎉',
      category: 'Events'
    },
    { 
      id: 'quiet-hours', 
      text: 'Quiet hours from 10 PM to 8 AM', 
      icon: '🤫',
      category: 'Noise'
    },
    { 
      id: 'no-pets', 
      text: 'No pets allowed', 
      icon: '🐾',
      category: 'Pets'
    },
    { 
      id: 'checkout-time', 
      text: 'Checkout time is 11:00 AM', 
      icon: '⏰',
      category: 'Timing'
    },
    { 
      id: 'no-shoes', 
      text: 'No shoes inside the property', 
      icon: '👟',
      category: 'Cleanliness'
    },
    { 
      id: 'max-guests', 
      text: 'Maximum number of guests as booked', 
      icon: '👥',
      category: 'Guests'
    },
    { 
      id: 'no-cooking', 
      text: 'No cooking of strong-smelling foods', 
      icon: '🍳',
      category: 'Cooking'
    },
    { 
      id: 'parking', 
      text: 'Parking available for registered guests only', 
      icon: '🚗',
      category: 'Parking'
    },
    { 
      id: 'wifi', 
      text: 'WiFi password provided upon check-in', 
      icon: '📶',
      category: 'Technology'
    },
    { 
      id: 'cleaning', 
      text: 'Please keep the property clean and tidy', 
      icon: '🧹',
      category: 'Cleanliness'
    },
    { 
      id: 'damage', 
      text: 'Report any damages immediately', 
      icon: '⚠️',
      category: 'Safety'
    }
  ];

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(rulesIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(suggestionsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    // Removed progressRef animation
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating rules icon animation
    gsap.to(rulesIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= RULES_LIMIT) {
      setHouseRules(value);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedSuggestions.includes(suggestion)) {
      setSelectedSuggestions(prev => prev.filter(s => s !== suggestion));
      setHouseRules(prev => prev.replace(suggestion + '\n', '').replace(suggestion, ''));
    } else {
      setSelectedSuggestions(prev => [...prev, suggestion]);
      setHouseRules(prev => prev + (prev ? '\n' : '') + suggestion);
    }

    // Animate the suggestion selection
    gsap.to(`[data-suggestion="${suggestion}"]`, { 
      scale: 1.05, 
      duration: 0.2, 
      yoyo: true, 
      repeat: 1,
      ease: 'power2.out'
    });
  };

  const handleNext = () => {
    // Save house rules to propertyData before proceeding
    onUpdate({ 
      houseRules: houseRules ? [{ rule: houseRules, allowed: true }] : [] 
    });
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={rulesIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          📋
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          House Rules
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Set clear expectations for your guests to ensure a smooth stay
        </p>
      </div>

      {/* Main Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-6">
          <div className={`transition-all duration-300 ${focusedField ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="houseRules">
              <span className="text-green-600">House Rules</span>
              <span className="text-gray-400 text-sm ml-2">(Optional but recommended)</span>
            </label>
            <div className="relative">
              <textarea
                id="houseRules"
                value={houseRules}
                onChange={handleChange}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400 resize-none"
                rows={8}
                placeholder="List your house rules here...&#10;&#10;Examples:&#10;• No smoking inside the property&#10;• Quiet hours from 10 PM to 8 AM&#10;• Checkout time is 11:00 AM"
              />
              <div className="absolute right-3 bottom-3">
                <span className={`text-sm font-medium text-gray-500`}>
                  {houseRules.length}/{RULES_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Clear house rules help set expectations and prevent misunderstandings
            </p>
          </div>
        </form>
      </div>

      {/* Rule Suggestions */}
      <div ref={suggestionsRef} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 shadow-lg border border-purple-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-purple-600 text-lg">Common House Rules</h3>
        </div>
        
        <div className="space-y-6">
          {ruleSuggestions.map((rule) => (
            <button
              key={rule.id}
              data-suggestion={rule.text}
              onClick={() => handleSuggestionClick(rule.text)}
              className={`p-3 rounded-xl transition-all duration-300 text-left ${
                selectedSuggestions.includes(rule.text)
                  ? 'bg-purple-100 border-2 border-purple-300 text-purple-700'
                  : 'bg-white/60 hover:bg-white hover:scale-105 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{rule.icon}</span>
                <span className="text-sm font-medium text-gray-800">{rule.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">✍️</div>
          <h3 className="font-bold text-blue-600 text-lg">Writing Tips</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '📋', tip: 'Be clear and specific about your expectations' },
            { icon: '🤝', tip: 'Keep rules reasonable and guest-friendly' },
            { icon: '📝', tip: 'Use bullet points for better readability' },
            { icon: '💡', tip: 'Include important safety and security rules' }
          ].map((tip, index) => (
            <div key={index} className="bg-white/60 rounded-xl p-4 hover:bg-white hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-xl">{tip.icon}</div>
                <p className="text-sm text-gray-700">{tip.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Preview */}
      {houseRules && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Rules Preview</h3>
          </div>
          
          <div className="bg-white/60 rounded-xl p-6">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {houseRules}
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
          onClick={handleNext}
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step1PoliciesRules;
