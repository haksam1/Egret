import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { PropertyData } from '../../ListOfProperty';

interface UploadPhotosScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UploadPhotosScreen: React.FC<UploadPhotosScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoGridRef = useRef<HTMLDivElement>(null);
  const selectBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [removingPhotoId, setRemovingPhotoId] = useState<string | null>(null);

  // Animate photo grid items on add/remove
  useEffect(() => {
    if (photoGridRef.current && !removingPhotoId) {
      gsap.fromTo(
        photoGridRef.current.children,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [data.photos, removingPhotoId]);

  // Animate Select Photos button on hover
  useEffect(() => {
    if (!selectBtnRef.current) return;
    const btn = selectBtnRef.current;
    const handleMouseEnter = () => {
      gsap.to(btn, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };
    btn.addEventListener('mouseenter', handleMouseEnter);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mouseenter', handleMouseEnter);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animate Next button when it becomes enabled
  useEffect(() => {
    if (nextBtnRef.current && data.photos && data.photos.length > 0) {
      gsap.fromTo(
        nextBtnRef.current,
        { scale: 0.9, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [data.photos && data.photos.length > 0]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = await Promise.all(filesArray.map(async (file, index) => {
        const base64 = await convertFileToBase64(file);
        return {
          id: `${Date.now()}-${index}`,
          url: base64
        };
      }));
      onUpdate({ photos: [...(data.photos || []), ...newPhotos] });
    }
  };

  const handleRemovePhoto = (id: string) => {
    setRemovingPhotoId(id);
    const photoIndex = (data.photos || []).findIndex((photo: any) => photo.id === id);
    if (photoGridRef.current && photoIndex !== -1) {
      const photoCard = photoGridRef.current.children[photoIndex];
      gsap.to(photoCard, {
        opacity: 0,
        scale: 0.7,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          const updatedPhotos = (data.photos || []).filter((photo: any) => photo.id !== id);
          onUpdate({ photos: updatedPhotos });
          setRemovingPhotoId(null);
        }
      });
    } else {
      // fallback if ref not found
      const updatedPhotos = (data.photos || []).filter((photo: any) => photo.id !== id);
      onUpdate({ photos: updatedPhotos });
      setRemovingPhotoId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Photos</h2>
      <p className="text-center text-gray-600 mb-6">
        Upload photos of your property to showcase it to potential guests.
      </p>
      <div className="mb-6 flex justify-center">
        <button
          ref={selectBtnRef}
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded shadow-lg transition-transform hover:scale-105 hover:from-green-600 hover:to-teal-700"
        >
          Select Photos
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div ref={photoGridRef} className="grid grid-cols-3 gap-4">
        {(data.photos || []).map((photo: any) => (
          <div key={String(photo.id)} className="relative">
            <img src={photo.url} alt="Property" className="w-full h-32 object-cover rounded shadow-md" />
            <button
              onClick={() => handleRemovePhoto(photo.id)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 shadow"
              aria-label="Remove photo"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          ref={nextBtnRef}
          onClick={onNext}
          disabled={!data.photos || data.photos.length === 0}
          className={`px-6 py-2 rounded text-white transition-all duration-200 shadow-lg ${
            data.photos && data.photos.length > 0
              ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UploadPhotosScreen;
