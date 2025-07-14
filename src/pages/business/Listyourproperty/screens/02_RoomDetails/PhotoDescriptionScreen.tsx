import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface PhotoDescriptionScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PhotoDescriptionScreen: React.FC<PhotoDescriptionScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>(data.photoDescriptions || {});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cameraIconRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(cameraIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(photosRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(progressRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.2, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating camera icon animation
    gsap.to(cameraIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered animation for photo cards
    if (photosRef.current) {
      const cards = photosRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleChange = (photoId: string, value: string) => {
    const updated = { ...descriptions, [photoId]: value };
    setDescriptions(updated);
    onUpdate({ photoDescriptions: updated });
  };

  const handlePhotoFocus = (index: number) => {
    setCurrentPhotoIndex(index);
    // Animate the focused photo
    const photoElement = document.querySelector(`[data-photo-index="${index}"]`);
    if (photoElement) {
      gsap.to(photoElement, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handlePhotoBlur = (index: number) => {
    const photoElement = document.querySelector(`[data-photo-index="${index}"]`);
    if (photoElement) {
      gsap.to(photoElement, { scale: 1, duration: 0.3, ease: 'power2.out' });
    }
  };

  const completionPercentage = data.photos && data.photos.length > 0 
    ? (Object.keys(descriptions).filter(key => descriptions[key].trim() !== '').length / data.photos.length) * 100 
    : 0;

  const maxDescriptionLength = 200;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={cameraIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          📸
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Photo Descriptions
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add descriptions to your uploaded photos to help guests understand your property better.
        </p>
        
        {/* Progress indicator */}
        {/* {data.photos && data.photos.length > 0 && (
          <div ref={progressRef} className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Described: {Object.keys(descriptions).filter(key => descriptions[key].trim() !== '').length}/{data.photos.length}</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )} */}
      </div>

      {/* Photos Section */}
      {data.photos && data.photos.length > 0 ? (
        <div ref={photosRef} className="space-y-8 mb-8">
          {data.photos.map((photo: any, index: number) => (
            <div
              key={photo.id}
              data-photo-index={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Photo Display */}
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={photo.url} 
                      alt={`Property photo ${index + 1}`} 
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-gray-700">
                      Photo {index + 1}
                    </div>
                  </div>
                  
                  {/* Photo overlay info */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600">
                    {photo.file ? photo.file.name : 'Uploaded image'}
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description for Photo {index + 1}
                    </label>
                    <textarea
                      className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      placeholder="Add a description for this photo..."
                      value={descriptions[photo.id] || ''}
                      onChange={(e) => handleChange(photo.id, e.target.value)}
                      onFocus={() => handlePhotoFocus(index)}
                      onBlur={() => handlePhotoBlur(index)}
                      rows={4}
                      maxLength={maxDescriptionLength}
                    />
                    
                    {/* Character counter */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">
                        {descriptions[photo.id]?.length || 0}/{maxDescriptionLength} characters
                      </div>
                      {descriptions[photo.id]?.length === maxDescriptionLength && (
                        <div className="text-xs text-orange-500">Maximum length reached</div>
                      )}
                    </div>
                  </div>

                  {/* Description tips */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Description Tips:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Describe what guests can see in this photo</li>
                      <li>• Mention key features or amenities shown</li>
                      <li>• Highlight the room's atmosphere or style</li>
                      <li>• Keep it concise but informative</li>
                    </ul>
                  </div>

                  {/* Completion indicator */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${descriptions[photo.id]?.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">
                      {descriptions[photo.id]?.trim() ? 'Description added' : 'No description yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-gray-300">📸</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Photos Uploaded</h3>
          <p className="text-gray-500">Please upload photos first to add descriptions.</p>
        </div>
      )}

      {/* Summary Section */}
      {data.photos && data.photos.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg border border-green-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📋</div>
            <h3 className="font-bold text-green-600 text-lg">Photo Description Summary</h3>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{data.photos.length}</div>
              <div className="text-sm text-gray-600">Total Photos</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(descriptions).filter(key => descriptions[key].trim() !== '').length}</div>
              <div className="text-sm text-gray-600">With Descriptions</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{data.photos.length - Object.keys(descriptions).filter(key => descriptions[key].trim() !== '').length}</div>
              <div className="text-sm text-gray-600">Need Descriptions</div>
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

export default PhotoDescriptionScreen;
