import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DescriptionStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DescriptionStep1: React.FC<DescriptionStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [title, setTitle] = useState(data.title || '');
  const [summary, setSummary] = useState(data.summary || '');
  const [description, setDescription] = useState(data.descriptionStep1 || '');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const penIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Character limits
  const TITLE_LIMIT = 100;
  const SUMMARY_LIMIT = 200;
  const DESCRIPTION_LIMIT = 1000;

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(penIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(tipsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating pen icon animation
    gsap.to(penIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= TITLE_LIMIT) {
      setTitle(value);
      onUpdate({ title: value });
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= SUMMARY_LIMIT) {
      setSummary(value);
      onUpdate({ summary: value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= DESCRIPTION_LIMIT) {
      setDescription(value);
      onUpdate({ descriptionStep1: value });
    }
  };

  const getProgressPercentage = () => {
    const totalFields = 3;
    const completedFields = [title, summary, description].filter(field => field.trim().length > 0).length;
    return (completedFields / totalFields) * 100;
  };

  const getFieldStatus = (value: string, limit: number) => {
    const length = value.length;
    const percentage = (length / limit) * 100;
    
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-orange-500';
    return 'text-gray-500';
  };

  const writingTips = [
    { icon: '✨', tip: 'Use descriptive adjectives to make your property stand out' },
    { icon: '📍', tip: 'Highlight unique features and nearby attractions' },
    { icon: '🏠', tip: 'Mention the type of experience guests can expect' },
    { icon: '💡', tip: 'Keep it authentic and honest about what you offer' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={penIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          ✍️
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Property Description
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create compelling descriptions that will attract guests to your property
        </p>
      </div>

      {/* Progress Bar */}
      {/* <div ref={progressRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Progress</h3>
          <span className="text-sm font-medium text-green-600">{Math.round(getProgressPercentage())}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Title</span>
          <span>Summary</span>
          <span>Description</span>
        </div>
      </div> */}

      {/* Main Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-8">
          {/* Title Field */}
          <div className={`transition-all duration-300 ${focusedField === 'title' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="title">
              <span className="text-green-600">Title</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400"
                placeholder="Enter a catchy title for your property..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className={`text-sm font-medium ${getFieldStatus(title, TITLE_LIMIT)}`}>
                  {title.length}/{TITLE_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Example: "Cozy Mountain Cabin with Stunning Views"
            </p>
          </div>

          {/* Summary Field */}
          <div className={`transition-all duration-300 ${focusedField === 'summary' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="summary">
              <span className="text-green-600">Summary</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="relative">
              <textarea
                id="summary"
                value={summary}
                onChange={handleSummaryChange}
                onFocus={() => setFocusedField('summary')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400 resize-none"
                rows={3}
                placeholder="Provide a brief summary of your property..."
              />
              <div className="absolute right-3 bottom-3">
                <span className={`text-sm font-medium ${getFieldStatus(summary, SUMMARY_LIMIT)}`}>
                  {summary.length}/{SUMMARY_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Keep it concise but informative - this appears in search results
            </p>
          </div>

          {/* Detailed Description Field */}
          <div className={`transition-all duration-300 ${focusedField === 'description' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="description">
              <span className="text-green-600">Detailed Description</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400 resize-none"
                rows={8}
                placeholder="Enter a detailed description to help guests understand your property better..."
              />
              <div className="absolute right-3 bottom-3">
                <span className={`text-sm font-medium ${getFieldStatus(description, DESCRIPTION_LIMIT)}`}>
                  {description.length}/{DESCRIPTION_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Describe the space, amenities, and what makes your property special
            </p>
          </div>
        </form>
      </div>

      {/* Writing Tips */}
      <div ref={tipsRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-blue-600 text-lg">Writing Tips</h3>
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

      {/* Summary Preview */}
      {(title || summary || description) && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Preview</h3>
          </div>
          
          <div className="bg-white/60 rounded-xl p-6">
            {title && (
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 text-xl mb-2">{title}</h4>
              </div>
            )}
            {summary && (
              <div className="mb-4">
                <p className="text-gray-600 text-lg leading-relaxed">{summary}</p>
              </div>
            )}
            {description && (
              <div>
                <p className="text-gray-700 leading-relaxed">{description}</p>
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
          disabled={!title.trim() || !summary.trim() || !description.trim()}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            title.trim() && summary.trim() && description.trim()
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

export default DescriptionStep1;
