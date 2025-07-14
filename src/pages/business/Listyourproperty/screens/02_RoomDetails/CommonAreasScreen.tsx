import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface CommonAreasScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const suggestedCommonAreas = [
  { name: 'Living Room', icon: '🛋️', description: 'Shared living space' },
  { name: 'Kitchen', icon: '🍳', description: 'Shared cooking area' },
  { name: 'Dining Room', icon: '🍽️', description: 'Shared dining space' },
  { name: 'Garden', icon: '🌿', description: 'Outdoor green space' },
  { name: 'Balcony', icon: '🌅', description: 'Outdoor balcony area' },
  { name: 'Terrace', icon: '🏞️', description: 'Rooftop terrace' },
  { name: 'Pool', icon: '🏊', description: 'Swimming pool area' },
  { name: 'Gym', icon: '💪', description: 'Fitness facilities' },
  { name: 'Lounge', icon: '🪑', description: 'Comfortable seating area' },
  { name: 'Library', icon: '📚', description: 'Reading and study space' },
  { name: 'Game Room', icon: '🎮', description: 'Entertainment area' },
  { name: 'Workspace', icon: '💼', description: 'Shared work area' }
];

const CommonAreasScreen: React.FC<CommonAreasScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [commonAreas, setCommonAreas] = useState<string[]>(data.commonAreas || []);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestedCommonAreas);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buildingIconRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const areasRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(buildingIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(inputRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(areasRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.5, ease: 'power2.out' });
    gsap.fromTo(suggestionsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating building icon animation
    gsap.to(buildingIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered animation for common area cards
    if (areasRef.current) {
      const cards = areasRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: 'back.out(1.7)' });
    }
  }, []);

  const addCommonArea = (areaName: string) => {
    if (areaName.trim() === '' || commonAreas.includes(areaName.trim())) return;
    
    const updated = [...commonAreas, areaName.trim()];
    setCommonAreas(updated);
    onUpdate({ commonAreas: updated });
    setInputValue('');
    setShowSuggestions(false);

    // Animate the new area card
    const newCard = document.querySelector(`[data-area="${areaName.trim()}"]`);
    if (newCard) {
      gsap.fromTo(newCard, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  };

  const removeCommonArea = (index: number) => {
    const areaToRemove = commonAreas[index];
    const updated = commonAreas.filter((_, i) => i !== index);
    setCommonAreas(updated);
    onUpdate({ commonAreas: updated });

    // Animate the removal
    const cardToRemove = document.querySelector(`[data-area="${areaToRemove}"]`);
    if (cardToRemove) {
      gsap.to(cardToRemove, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        // The card will be removed from DOM after animation
      }});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() === '') {
      setFilteredSuggestions(suggestedCommonAreas);
      setShowSuggestions(false);
    } else {
      const filtered = suggestedCommonAreas.filter(area => 
        area.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCommonArea(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addCommonArea(suggestion);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={buildingIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          🏢
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Common Areas
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Define common areas available in your property.
        </p>
      </div>

      {/* Input Section */}
      <div ref={inputRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Add a common area..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <span className="text-xl">{suggestion.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">{suggestion.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => addCommonArea(inputValue)}
            disabled={inputValue.trim() === ''}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputValue.trim() !== ''
                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Area
          </button>
        </div>
      </div>

      {/* Common Areas Display */}
      <div ref={areasRef} className="mb-8">
        {commonAreas.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4 text-gray-300">🏢</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Common Areas Defined</h3>
            <p className="text-gray-500">Start adding common areas above to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonAreas.map((area, index) => (
              <div
                key={index}
                data-area={area}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {suggestedCommonAreas.find(s => s.name === area)?.icon || '🏢'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{area}</h3>
                      <p className="text-sm text-gray-500">
                        {suggestedCommonAreas.find(s => s.name === area)?.description || 'Common area'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCommonArea(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Area #{index + 1}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Added
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div ref={suggestionsRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-blue-600 text-lg">Popular Common Areas</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suggestedCommonAreas.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.name)}
              disabled={commonAreas.includes(suggestion.name)}
              className={`p-4 rounded-xl transition-all duration-300 text-center ${
                commonAreas.includes(suggestion.name)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white/60 hover:bg-white hover:scale-105 hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-2">{suggestion.icon}</div>
              <div className="font-medium text-sm text-gray-800">{suggestion.name}</div>
              <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      {commonAreas.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📋</div>
            <h3 className="font-bold text-green-600 text-lg">Common Areas Summary</h3>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{commonAreas.length}</div>
              <div className="text-sm text-gray-600">Total Areas</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{commonAreas.filter(area => suggestedCommonAreas.some(s => s.name === area)).length}</div>
              <div className="text-sm text-gray-600">Standard Areas</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{commonAreas.filter(area => !suggestedCommonAreas.some(s => s.name === area)).length}</div>
              <div className="text-sm text-gray-600">Custom Areas</div>
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

export default CommonAreasScreen;
