import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PropertyData } from '../../ListOfProperty';

interface StepProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step4PoliciesRules: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [rulesAccepted, setRulesAccepted] = useState(false);

  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLUListElement>(null);
  const checkboxRef = useRef<HTMLLabelElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Entrance animations
  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 });
    gsap.fromTo(iconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(checklistRef.current?.children, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.5 });
    gsap.fromTo(checkboxRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.8 });
    gsap.fromTo(progressRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.9 });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 1 });

    // Floating animation
    gsap.to(iconRef.current, { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, []);

  const rules = [
    { icon: '🤫', text: 'Guests must respect quiet hours from 10 PM to 7 AM.' },
    { icon: '🚭', text: 'No smoking allowed inside the property.' },
    { icon: '🐾', text: 'Pets are not allowed unless explicitly stated.' },
    { icon: '⏰', text: 'Check-in is from 3 PM, and check-out is by 11 AM.' },
    { icon: '📜', text: 'Guests must follow all local laws and regulations.' },
  ];

  const handleNext = () => {
    // Save acceptance status to propertyData before proceeding
    const acceptanceRule = { rule: 'Policies and rules accepted by host', allowed: rulesAccepted };
    
    // Merge with existing house rules
    const existingRules = Array.isArray(data.houseRules) ? data.houseRules : [];
    onUpdate({ 
      houseRules: [...existingRules, acceptanceRule]
    });
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div ref={iconRef} className="text-7xl mb-4 hover:scale-110 transition-transform duration-300 cursor-pointer">
          🛡️
        </div>
        <h1
          ref={titleRef}
          className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
        >
          Review & Accept Policies
        </h1>
        <p ref={subtitleRef} className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
          Please carefully review and accept the following rules and policies before proceeding with your listing.
        </p>
      </div>

      {/* Rules Checklist */}
      <section className="max-w-2xl mx-auto mb-8">
        <ul ref={checklistRef} className="space-y-4">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="flex items-start gap-4 p-4 bg-white/80 border border-white/20 shadow rounded-xl"
            >
              <span className="text-2xl mt-1">{rule.icon}</span>
              <p className="text-gray-700 text-base font-medium">{rule.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Acceptance Checkbox */}
      <section className="flex justify-center mb-8">
        <label
          ref={checkboxRef}
          className="inline-flex items-center cursor-pointer text-lg font-medium"
        >
          <input
            type="checkbox"
            checked={rulesAccepted}
            onChange={() => setRulesAccepted(!rulesAccepted)}
            className="form-checkbox h-6 w-6 text-green-600 rounded-lg border-2 border-green-400 transition-all duration-300 focus:ring-2 focus:ring-green-300"
          />
          <span
            className={`ml-3 transition-colors duration-300 ${
              rulesAccepted ? 'text-green-700 font-semibold' : 'text-gray-700'
            }`}
          >
            I accept the policies and rules.
          </span>
        </label>
      </section>

      {/* Navigation Buttons */}
      <section ref={buttonsRef} className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-8 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!rulesAccepted}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            rulesAccepted
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </section>

      {/* Optional Progress Bar Placeholder */}
      <div ref={progressRef} className="mt-6 text-center text-sm text-gray-500">
        Step 4 of 4
      </div>
    </div>
  );
};

export default Step4PoliciesRules;