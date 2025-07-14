import React, { useState, useRef, useEffect } from 'react';
import { PropertyData } from '../../ListOfProperty';
import { InputField } from '../../components/common/InputField';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import gsap from 'gsap';

interface BuildingInfoScreenProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const buildingTypes = [
  { value: 'apartment', label: 'Apartment Building', icon: '🏢' },
  { value: 'house', label: 'Single Family House', icon: '🏠' },
  { value: 'condo', label: 'Condominium', icon: '🏘️' },
  { value: 'townhouse', label: 'Townhouse', icon: '🏡' },
  { value: 'villa', label: 'Villa', icon: '🏰' },
  { value: 'other', label: 'Other', icon: '🏗️' }
];

const BuildingInfoScreen: React.FC<BuildingInfoScreenProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [buildingInfo, setBuildingInfo] = useState(data.buildingInfo || {
    buildingType: '',
    buildingName: '',
    yearBuilt: '',
    floor: '',
    elevator: '',
    parking: '',
    accessibility: ''
  });

  // GSAP refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buildingIconRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formFieldsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main entrance animations
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(buildingIconRef.current, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' });
    gsap.fromTo(formRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

    // Floating building icon animation
    gsap.to(buildingIconRef.current, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Staggered form fields animation
    if (formFieldsRef.current) {
      const fields = formFieldsRef.current.children;
      gsap.fromTo(fields, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: 'power2.out' });
    }

    // Summary card animation
    gsap.fromTo(summaryRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'back.out(1.7)' });

    // Progress bar animation
    gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, delay: 1, ease: 'power2.out' });

  }, []);

  const handleChange = (field: string, value: string) => {
    const updated = { ...buildingInfo, [field]: value };
    setBuildingInfo(updated);
    onUpdate({ buildingInfo: updated });
  };

  // Calculate completion percentage
  const completedFields = Object.values(buildingInfo).filter(value => value !== '').length;
  const totalFields = Object.keys(buildingInfo).length;
  const completionPercentage = (completedFields / totalFields) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10 relative">
        <div ref={buildingIconRef} className="text-8xl mb-4 cursor-pointer hover:scale-110 transition-transform duration-300">
          🏢
        </div>
        <h1 ref={titleRef} className="text-4xl font-bold text-green-600 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Tell us about your building
        </h1>
        <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          These details help guests understand your property better
        </p>
        
        {/* Progress indicator */}
        {/* <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-500"
              style={{ transformOrigin: 'left' }}
            ></div>
          </div>
        </div> */}
      </div>

      {/* Main Form Container */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-12 right-4 w-1 h-1 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div ref={formFieldsRef} className="relative z-10">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <SelectDropdown
                label="Building Type"
                value={buildingInfo.buildingType}
                onChange={(value) => handleChange('buildingType', value)}
                options={buildingTypes}
                placeholder="Select building type"
              />
            </div>

            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <InputField
                label="Building Name"
                value={buildingInfo.buildingName}
                onChange={(value) => handleChange('buildingName', value)}
                placeholder="e.g., Sunset Towers"
                helperText="If applicable"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <InputField
                label="Year Built"
                value={buildingInfo.yearBuilt}
                onChange={(value) => handleChange('yearBuilt', value)}
                placeholder="e.g., 2020"
                type="number"
              />
            </div>

            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <InputField
                label="Floor Number"
                value={buildingInfo.floor}
                onChange={(value) => handleChange('floor', value)}
                placeholder="e.g., 3rd floor"
                helperText="Ground floor, 1st, 2nd, etc."
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <SelectDropdown
                label="Elevator Available"
                value={buildingInfo.elevator}
                onChange={(value) => handleChange('elevator', value)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
                placeholder="Select option"
              />
            </div>

            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <SelectDropdown
                label="Parking Available"
                value={buildingInfo.parking}
                onChange={(value) => handleChange('parking', value)}
                options={[
                  { value: 'free', label: 'Free Parking' },
                  { value: 'paid', label: 'Paid Parking' },
                  { value: 'street', label: 'Street Parking' },
                  { value: 'none', label: 'No Parking' }
                ]}
                placeholder="Select option"
              />
            </div>

            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <SelectDropdown
                label="Accessibility Features"
                value={buildingInfo.accessibility}
                onChange={(value) => handleChange('accessibility', value)}
                options={[
                  { value: 'wheelchair', label: 'Wheelchair Accessible' },
                  { value: 'partial', label: 'Partially Accessible' },
                  { value: 'none', label: 'No Special Features' }
                ]}
                placeholder="Select option"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Summary Card */}
        <div ref={summaryRef} className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🏢</div>
            <h3 className="font-bold text-green-600 text-lg">Building Summary</h3>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {buildingInfo.buildingType && (
                <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                  <span className="text-green-500">🏗️</span>
                  <span className="text-sm font-medium">Type: {buildingTypes.find(t => t.value === buildingInfo.buildingType)?.label}</span>
                </div>
              )}
              {buildingInfo.buildingName && (
                <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                  <span className="text-green-500">🏢</span>
                  <span className="text-sm font-medium">Name: {buildingInfo.buildingName}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {buildingInfo.yearBuilt && (
                <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                  <span className="text-green-500">📅</span>
                  <span className="text-sm font-medium">Built: {buildingInfo.yearBuilt}</span>
                </div>
              )}
              {buildingInfo.floor && (
                <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                  <span className="text-green-500">🏢</span>
                  <span className="text-sm font-medium">Floor: {buildingInfo.floor}</span>
                </div>
              )}
            </div>
          </div>
          
          {completedFields === 0 && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              Start filling in the details above to see your building summary
            </div>
          )}
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
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default BuildingInfoScreen;
