import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaCamera, FaInfoCircle, FaDollarSign, FaReply, FaCalendarAlt } from 'react-icons/fa';

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

const tips = [
  { icon: <FaCamera />, text: 'Make sure your property photos are clear and high quality.' },
  { icon: <FaInfoCircle />, text: 'Provide detailed and accurate descriptions.' },
  { icon: <FaDollarSign />, text: 'Set competitive pricing based on market research.' },
  { icon: <FaReply />, text: 'Respond promptly to guest inquiries.' },
  { icon: <FaCalendarAlt />, text: 'Keep your calendar up to date.' },
];

const OnboardingTips: React.FC<StepProps> = ({ onNext, onPrev }) => {
  const tipsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (tipsRef.current) {
      gsap.fromTo(
        tipsRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text mb-6">
        Onboarding Tips
      </h2>

      <ul ref={tipsRef} className="space-y-4 text-gray-700">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="text-teal-600 mt-1 text-lg">{tip.icon}</div>
            <p className="text-base leading-relaxed">{tip.text}</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all shadow-lg"
        >
          Finish →
        </button>
      </div>
    </div>
  );
};

export default OnboardingTips;
