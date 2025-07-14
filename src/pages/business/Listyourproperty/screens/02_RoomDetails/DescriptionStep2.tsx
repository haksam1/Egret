import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DescriptionStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DescriptionStep2: React.FC<DescriptionStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [headline, setHeadline] = useState(data.headline || '');
  const [details, setDetails] = useState(data.descriptionStep2 || '');
  const [highlights, setHighlights] = useState(data.highlights || []);
  const [newHighlight, setNewHighlight] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Character limits
  const HEADLINE_LIMIT = 80;
  const DETAILS_LIMIT = 800;

  // Headline suggestions
  const headlineSuggestions = [
    "What Makes This Place Special",
    "Perfect Location & Views",
    "Comfort & Amenities",
    "Local Attractions",
    "Guest Experience",
    "Unique Features",
    "Surrounding Area",
    "What You'll Love"
  ];

  // Highlight suggestions
  const highlightSuggestions = [
    "Stunning mountain views",
    "Private balcony",
    "Fully equipped kitchen",
    "Free WiFi",
    "Parking included",
    "Walking distance to attractions",
    "Peaceful neighborhood",
    "Modern amenities"
  ];

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(headlineIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(suggestionsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating headline icon animation
    gsap.to(headlineIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, []);

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= HEADLINE_LIMIT) {
      setHeadline(value);
      onUpdate({ headline: value });
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= DETAILS_LIMIT) {
      setDetails(value);
      onUpdate({ descriptionStep2: value });
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      const updatedHighlights = [...highlights, newHighlight.trim()];
      setHighlights(updatedHighlights);
      onUpdate({ highlights: updatedHighlights });
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(updatedHighlights);
    onUpdate({ highlights: updatedHighlights });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setHeadline(suggestion);
    onUpdate({ headline: suggestion });
    setSelectedSuggestion(suggestion);
    
    // Animate the suggestion selection
    gsap.to(`[data-suggestion="${suggestion}"]`, { 
      scale: 1.05, 
      duration: 0.2, 
      yoyo: true, 
      repeat: 1,
      ease: 'power2.out'
    });
  };

  const handleHighlightSuggestionClick = (suggestion: string) => {
    if (!highlights.includes(suggestion)) {
      const updatedHighlights = [...highlights, suggestion];
      setHighlights(updatedHighlights);
      onUpdate({ highlights: updatedHighlights });
    }
  };

  const getProgressPercentage = () => {
    const totalFields = 3;
    const completedFields = [headline, details, highlights.length > 0].filter(Boolean).length;
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
    { icon: '🎯', tip: 'Keep headlines concise and attention-grabbing' },
    { icon: '📝', tip: 'Use specific details to paint a picture for guests' },
    { icon: '🌟', tip: 'Highlight what makes your property unique' },
    { icon: '💬', tip: 'Write as if you\'re talking to a friend' }
  ];

  const getHeadlineIcon = (headlineText: string) => {
    const lowerText = headlineText.toLowerCase();
    if (lowerText.includes('special') || lowerText.includes('unique')) return '⭐';
    if (lowerText.includes('location') || lowerText.includes('view')) return '📍';
    if (lowerText.includes('comfort') || lowerText.includes('amenity')) return '🏠';
    if (lowerText.includes('attraction') || lowerText.includes('local')) return '🎪';
    if (lowerText.includes('experience') || lowerText.includes('guest')) return '👥';
    if (lowerText.includes('feature') || lowerText.includes('highlight')) return '✨';
    if (lowerText.includes('area') || lowerText.includes('surrounding')) return '🌍';
    if (lowerText.includes('love') || lowerText.includes('enjoy')) return '❤️';
    return '📰';
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={headlineIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          📰
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Section Details
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add a compelling headline and detailed information to showcase your property
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
          <span>Headline</span>
          <span>Details</span>
        </div>
      </div> */}

      {/* Main Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
        <form className="space-y-8">
          {/* Headline Field */}
          <div className={`transition-all duration-300 ${focusedField === 'headline' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="headline">
              <span className="text-green-600">Headline</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="relative">
              <input
                id="headline"
                type="text"
                value={headline}
                onChange={handleHeadlineChange}
                onFocus={() => setFocusedField('headline')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400"
                placeholder="Enter a headline for this section..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {headline && (
                  <span className="text-xl">{getHeadlineIcon(headline)}</span>
                )}
                <span className={`text-sm font-medium ${getFieldStatus(headline, HEADLINE_LIMIT)}`}>
                  {headline.length}/{HEADLINE_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Create an engaging headline that captures attention
            </p>
          </div>

          {/* Details Field */}
          <div className={`transition-all duration-300 ${focusedField === 'details' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="details">
              <span className="text-green-600">Details</span>
              <span className="text-gray-400 text-sm ml-2">(Required)</span>
            </label>
            <div className="relative">
              <textarea
                id="details"
                value={details}
                onChange={handleDetailsChange}
                onFocus={() => setFocusedField('details')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400 resize-none"
                rows={8}
                placeholder="Provide detailed information about this aspect of your property..."
              />
              <div className="absolute right-3 bottom-3">
                <span className={`text-sm font-medium ${getFieldStatus(details, DETAILS_LIMIT)}`}>
                  {details.length}/{DETAILS_LIMIT}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Provide rich, descriptive content that helps guests understand this aspect of your property
            </p>
          </div>

          {/* Highlights Field */}
          <div className={`transition-all duration-300 ${focusedField === 'highlights' ? 'scale-105' : ''}`}>
            <label className="block mb-3 font-bold text-gray-800 text-lg" htmlFor="highlights">
              <span className="text-green-600">Property Highlights</span>
              <span className="text-gray-400 text-sm ml-2">(Optional but recommended)</span>
            </label>
            <div className="space-y-4">
              {/* Add new highlight */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onFocus={() => setFocusedField('highlights')}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg placeholder-gray-400"
                  placeholder="Add a highlight (e.g., Stunning mountain views)"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  disabled={!newHighlight.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Add
                </button>
              </div>
              
              {/* Current highlights */}
              {highlights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Highlights:</p>
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                        <span className="text-green-800">✨ {highlight}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add key features and amenities that make your property special
            </p>
          </div>
        </form>
      </div>

      {/* Headline Suggestions */}
      <div ref={suggestionsRef} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 shadow-lg border border-purple-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-purple-600 text-lg">Headline Suggestions</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headlineSuggestions.map((suggestion, index) => (
            <button
              key={index}
              data-suggestion={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-4 rounded-xl transition-all duration-300 text-center ${
                headline === suggestion
                  ? 'bg-purple-100 border-2 border-purple-300 text-purple-700'
                  : 'bg-white/60 hover:bg-white hover:scale-105 hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-2">{getHeadlineIcon(suggestion)}</div>
              <div className="font-medium text-sm text-gray-800">{suggestion}</div>
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

      {/* Content Preview */}
      {(headline || details || highlights.length > 0) && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">👁️</div>
            <h3 className="font-bold text-green-600 text-lg">Content Preview</h3>
          </div>
          
          <div className="bg-white/60 rounded-xl p-6">
            {headline && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getHeadlineIcon(headline)}</span>
                  <h4 className="font-bold text-gray-800 text-xl">{headline}</h4>
                </div>
              </div>
            )}
            {details && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{details}</p>
              </div>
            )}
            {highlights.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Highlights:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="text-green-700">✨ {highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Highlight Suggestions */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 shadow-lg border border-yellow-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-yellow-600 text-lg">Highlight Suggestions</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlightSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleHighlightSuggestionClick(suggestion)}
              disabled={highlights.includes(suggestion)}
              className={`p-3 rounded-xl transition-all duration-300 text-center ${
                highlights.includes(suggestion)
                  ? 'bg-yellow-100 border-2 border-yellow-300 text-yellow-700 cursor-not-allowed'
                  : 'bg-white/60 hover:bg-white hover:scale-105 hover:shadow-md'
              }`}
            >
              <div className="font-medium text-sm text-gray-800">{suggestion}</div>
            </button>
          ))}
        </div>
      </div>

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
          disabled={!headline.trim() || !details.trim()}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            headline.trim() && details.trim()
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

export default DescriptionStep2;
