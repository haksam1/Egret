import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import gsap from 'gsap';

interface PhotoOrderScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PhotoOrderScreen: React.FC<PhotoOrderScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [photoOrder, setPhotoOrder] = useState<string[]>(data.photoOrder || []);
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const photosIconRef = useRef<HTMLDivElement>(null);
  const photosContainerRef = useRef<HTMLDivElement>(null);
  const coverPhotoRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize photo order if empty
    if (photoOrder.length === 0 && data.photos && data.photos.length > 0) {
      const initialOrder = data.photos.map(photo => photo.id);
      setPhotoOrder(initialOrder);
      onUpdate({ photoOrder: initialOrder });
    }

    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(photosIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(coverPhotoRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' });
    gsap.fromTo(photosContainerRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.5, ease: 'power2.out' });
    gsap.fromTo(instructionsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating photos icon animation
    gsap.to(photosIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered animation for photo cards
    if (photosContainerRef.current) {
      const cards = photosContainerRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, photoId: string) => {
    setDraggedPhoto(photoId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    
    // Animate the dragged element
    const draggedElement = e.currentTarget as HTMLElement;
    gsap.to(draggedElement, { scale: 1.05, rotation: 5, duration: 0.2, ease: 'power2.out' });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDraggedPhoto(null);
    
    // Reset the dragged element
    const draggedElement = e.currentTarget as HTMLElement;
    gsap.to(draggedElement, { scale: 1, rotation: 0, duration: 0.2, ease: 'power2.out' });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPhotoId: string) => {
    e.preventDefault();
    
    if (!draggedPhoto || draggedPhoto === targetPhotoId) return;

    const newOrder = [...photoOrder];
    const draggedIndex = newOrder.indexOf(draggedPhoto);
    const targetIndex = newOrder.indexOf(targetPhotoId);

    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedPhoto);

    setPhotoOrder(newOrder);
    onUpdate({ photoOrder: newOrder });

    // Animate the reordering
    const targetElement = e.currentTarget as HTMLElement;
    gsap.to(targetElement, { scale: 1.1, duration: 0.2, ease: 'power2.out' });
    gsap.to(targetElement, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.out' });
  };

  const movePhoto = (photoId: string, direction: 'up' | 'down') => {
    const currentIndex = photoOrder.indexOf(photoId);
    if (currentIndex === -1) return;

    const newOrder = [...photoOrder];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      setPhotoOrder(newOrder);
      onUpdate({ photoOrder: newOrder });

      // Animate the movement
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"]`);
      if (photoElement) {
        gsap.to(photoElement, { y: direction === 'up' ? -10 : 10, duration: 0.2, ease: 'power2.out' });
        gsap.to(photoElement, { y: 0, duration: 0.2, delay: 0.2, ease: 'power2.out' });
      }
    }
  };

  const getPhotoById = (photoId: string) => {
    return data.photos?.find(photo => photo.id === photoId);
  };

  const coverPhoto = photoOrder.length > 0 ? getPhotoById(photoOrder[0]) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div ref={photosIconRef} className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          📸
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Organize Your Photos
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Arrange your photos in the order guests will see them. The first photo is shown as the cover image.
        </p>
      </div>

      {/* Cover Photo Preview */}
      {coverPhoto && (
        <div ref={coverPhotoRef} className="mb-8">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-green-100/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🏆</div>
              <h3 className="font-bold text-green-600 text-lg">Cover Photo Preview</h3>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={coverPhoto.url} 
                alt="Cover photo" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-sm font-semibold text-gray-800">Photo 1 - Cover Image</div>
                <div className="text-xs text-gray-600">This will be the first photo guests see</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      {data.photos && data.photos.length > 0 ? (
        <div ref={photosContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {photoOrder.map((photoId, index) => {
            const photo = getPhotoById(photoId);
            if (!photo) return null;

            return (
              <div
                key={photoId}
                data-photo-id={photoId}
                draggable
                onDragStart={(e) => handleDragStart(e, photoId)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, photoId)}
                className={`relative group cursor-move transition-all duration-300 transform hover:scale-105 ${
                  isDragging && draggedPhoto === photoId ? 'opacity-50' : ''
                } ${index === 0 ? 'ring-4 ring-green-400 ring-opacity-50' : ''}`}
              >
                {/* Photo Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  
                  {/* Photo */}
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={photo.url} 
                      alt={`Photo ${index + 1}`} 
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Photo Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">Photo {index + 1}</span>
                        {index === 0 && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Cover</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>

                    {/* Move Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => movePhoto(photoId, 'up')}
                        disabled={index === 0}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          index === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                      >
                        ↑ Up
                      </button>
                      <button
                        onClick={() => movePhoto(photoId, 'down')}
                        disabled={index === photoOrder.length - 1}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          index === photoOrder.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                      >
                        ↓ Down
                      </button>
                    </div>

                    {/* Drag Indicator */}
                    <div className="text-center">
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <span>↕️</span>
                        <span>Drag to reorder</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-gray-300">📸</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Photos Uploaded</h3>
          <p className="text-gray-500">Please upload photos first to organize them.</p>
        </div>
      )}

      {/* Instructions */}
      <div ref={instructionsRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-lg border border-blue-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-blue-600 text-lg">Photo Organization Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-blue-500 text-lg">1️⃣</span>
              <div>
                <h4 className="font-semibold text-gray-800">Cover Photo</h4>
                <p className="text-sm text-gray-600">Choose your best photo as the first image</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-blue-500 text-lg">2️⃣</span>
              <div>
                <h4 className="font-semibold text-gray-800">Drag & Drop</h4>
                <p className="text-sm text-gray-600">Drag photos to reorder them easily</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-blue-500 text-lg">3️⃣</span>
              <div>
                <h4 className="font-semibold text-gray-800">Story Flow</h4>
                <p className="text-sm text-gray-600">Arrange photos to tell your property's story</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <span className="text-blue-500 text-lg">4️⃣</span>
              <div>
                <h4 className="font-semibold text-gray-800">Guest Experience</h4>
                <p className="text-sm text-gray-600">Think about what guests want to see first</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div ref={buttonsRef} className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-8 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default PhotoOrderScreen;
