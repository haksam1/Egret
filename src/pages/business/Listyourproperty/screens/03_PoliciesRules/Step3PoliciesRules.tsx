import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PropertyData } from '../../ListOfProperty';

interface StepProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface RuleToggleProps {
  label: string;
  icon: string;
  value: boolean;
  setValue: (val: boolean) => void;
  color: string;
}

const RuleToggle: React.FC<RuleToggleProps> = ({ label, icon, value, setValue, color }) => {
  const activeBg = {
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500',
  }[color];

  const ringColor = {
    green: 'focus:ring-green-400',
    teal: 'focus:ring-teal-400',
    purple: 'focus:ring-purple-400',
    blue: 'focus:ring-blue-400',
    yellow: 'focus:ring-yellow-300',
    red: 'focus:ring-red-400',
  }[color];

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition duration-300">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${value ? `text-${color}-600` : 'text-gray-400'}`}>
          {value ? 'Allowed' : 'Not Allowed'}
        </span>
        <button
          type="button"
          aria-pressed={value}
          onClick={() => setValue(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${activeBg} ${ringColor}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const Step3PoliciesRules: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [partiesAllowed, setPartiesAllowed] = useState(false);
  const [childrenAllowed, setChildrenAllowed] = useState(false);
  const [quietHours, setQuietHours] = useState(false);
  const [alcoholAllowed, setAlcoholAllowed] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const policyIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(policyIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    gsap.to(policyIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const rules = [
    { label: 'Smoking', icon: '🚬', value: smokingAllowed, setValue: setSmokingAllowed, color: 'green' },
    { label: 'Pets', icon: '🐾', value: petsAllowed, setValue: setPetsAllowed, color: 'teal' },
    { label: 'Parties', icon: '🎉', value: partiesAllowed, setValue: setPartiesAllowed, color: 'purple' },
    { label: 'Children', icon: '👶', value: childrenAllowed, setValue: setChildrenAllowed, color: 'blue' },
    { label: 'Quiet Hours', icon: '🔇', value: quietHours, setValue: setQuietHours, color: 'yellow' },
    { label: 'Alcohol', icon: '🍷', value: alcoholAllowed, setValue: setAlcoholAllowed, color: 'red' },
  ];

  const handleNext = () => {
    // Save policy rules to propertyData before proceeding
    const policyRules = rules.map(rule => ({
      rule: rule.label,
      allowed: rule.value
    }));
    
    // Merge with existing house rules
    const existingRules = Array.isArray(data.houseRules) ? data.houseRules : [];
    onUpdate({ 
      houseRules: [...existingRules, ...policyRules]
    });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div ref={policyIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">🛡️</div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Rules & Policies
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose which rules apply to your property
        </p>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20 space-y-6">
        {rules.map(rule => (
          <RuleToggle key={rule.label} {...rule} />
        ))}
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">👁️</div>
          <h3 className="font-bold text-green-600 text-lg">Preview</h3>
        </div>
        <div className="bg-white/60 rounded-xl p-6 flex flex-col gap-4">
          {rules.map(rule => (
            <div className="flex items-center gap-3" key={rule.label}>
              <span className="text-2xl">{rule.icon}</span>
              <span className="font-bold text-gray-800">{rule.label}:</span>
              <span className={rule.value ? `text-${rule.color}-600 font-semibold` : 'text-gray-400 font-semibold'}>
                {rule.value ? 'Allowed' : 'Not Allowed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div ref={buttonsRef} className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-8 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step3PoliciesRules;
