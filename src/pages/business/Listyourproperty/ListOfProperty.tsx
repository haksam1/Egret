

import React, { useState } from 'react';
import { AnimatedWrapper } from './components/common/AnimatedWrapper';
import { StepIndicator } from './components/common/StepIndicator';
import { apiService } from '../../../services/apiService';
import { motion } from "framer-motion";
import { validatePropertyData, logValidationSummary } from '../../../utils/dataValidation';

export interface Photo {
  id: string;
  url: string;
  file?: File;
}

export interface PropertyData {
  propertyType: string;
  propertyGroup: string;
  propertyName: string;
  location: any;
  streetDetails: any;
  buildingInfo: any;
  roomCount: number;
  bathroomCount: number;
  sharedSpaces: string[];
  bedType: string[];
  bedCount: number[]; // changed to array of numbers
  roomType: string;
  privateOrShared: string;
  roomSize: number;
  
  amenities: string[];
  kitchenAmenities: string[];
  outdoorFacilities: string[];
  photos: Photo[];
  photoOrder: string[];
  photoDescriptions: Record<string, any>; // changed to object

  commonAreas: string[];

  // Added missing properties to fix TS errors
  title: string;
  description: string; // changed to string
  highlights: string[];
  basePrice: number;
  currency: string;
  cancellationPolicy: string;
  cleaningFee: number;

  // Added additional missing fields
  availabilityData: any | null;
  discount?: number;
  houseRules: object[]; // changed to array of objects
  paymentData: any | null;
  preferredLanguage: string | null;
  pricingData: any | null;

  // Added missing pricing fields
  minimumStay?: string;
  maximumStay?: string;
  weekendPrice?: number;

  // Added missing description step fields
  descriptionStep1?: string;
  descriptionStep2?: string;
}

// Import all screens
// 01. Property Basics
import PropertyTypeScreen from './screens/01_PropertyBasics/PropertyTypeScreen';
import PropertyGroupScreen from './screens/01_PropertyBasics/PropertyGroupScreen';
import PropertyNameScreen from './screens/01_PropertyBasics/PropertyNameScreen';
import PropertyLocationScreen from './screens/01_PropertyBasics/PropertyLocationScreen';
import MapLocationConfirmScreen from './screens/01_PropertyBasics/MapLocationConfirmScreen';
import StreetDetailsScreen from './screens/01_PropertyBasics/StreetDetailsScreen';
import BuildingInfoScreen from './screens/01_PropertyBasics/BuildingInfoScreen';
import RoomCountScreen from './screens/01_PropertyBasics/RoomCountScreen';
import BathroomCountScreen from './screens/01_PropertyBasics/BathroomCountScreen';
import SharedSpacesScreen from './screens/01_PropertyBasics/SharedSpacesScreen';

// 02. Room Details
import BedTypeScreen from './screens/02_RoomDetails/BedTypeScreen';
import BedCountScreen from './screens/02_RoomDetails/BedCountScreen';
import RoomTypeScreen from './screens/02_RoomDetails/RoomTypeScreen';
import PrivateOrSharedScreen from './screens/02_RoomDetails/PrivateOrSharedScreen';
import RoomSizeScreen from './screens/02_RoomDetails/RoomSizeScreen';
import AmenitiesSelectionScreen from './screens/02_RoomDetails/AmenitiesSelectionScreen';
import KitchenAmenitiesScreen from './screens/02_RoomDetails/KitchenAmenitiesScreen';
import OutdoorFacilitiesScreen from './screens/02_RoomDetails/OutdoorFacilitiesScreen';
import UploadPhotosScreen from './screens/02_RoomDetails/UploadPhotosScreen';
import PhotoOrderScreen from './screens/02_RoomDetails/PhotoOrderScreen';
import PhotoDescriptionScreen from './screens/02_RoomDetails/PhotoDescriptionScreen';
import CommonAreasScreen from './screens/02_RoomDetails/CommonAreasScreen';

// Import Description and Policies & Rules screens
import DescriptionStep1 from './screens/02_RoomDetails/DescriptionStep1';
import DescriptionStep2 from './screens/02_RoomDetails/DescriptionStep2';
import DescriptionStep3 from './screens/02_RoomDetails/DescriptionStep3';
import DescriptionStep4 from './screens/02_RoomDetails/DescriptionStep4';
import DescriptionStep5 from './screens/02_RoomDetails/DescriptionStep5';
import DescriptionStep6 from './screens/02_RoomDetails/DescriptionStep6';
import DescriptionStep7 from './screens/02_RoomDetails/DescriptionStep7';
import DescriptionStep8 from './screens/02_RoomDetails/DescriptionStep8';

import Step1PoliciesRules from './screens/03_PoliciesRules/Step1PoliciesRules';
import Step2PoliciesRules from './screens/03_PoliciesRules/Step2PoliciesRules';
import Step3PoliciesRules from './screens/03_PoliciesRules/Step3PoliciesRules';
import Step4PoliciesRules from './screens/03_PoliciesRules/Step4PoliciesRules';

import Step1PricingAvailability from './screens/04_PricingAvailability/Step1PricingAvailability';
import Step2PricingAvailability from './screens/04_PricingAvailability/Step2PricingAvailability';
import Step3PricingAvailability from './screens/04_PricingAvailability/Step3PricingAvailability';
import Step4PricingAvailability from './screens/04_PricingAvailability/Step4PricingAvailability';
import Step5PricingAvailability from './screens/04_PricingAvailability/Step5PricingAvailability';
import Step6PricingAvailability from './screens/04_PricingAvailability/Step6PricingAvailability';

import PaymentsAndTaxes from './screens/05_PaymentsTaxes/PaymentsAndTaxes';
import FormScreen from './screens/FormScreen';
import SubmissionSuccessScreen from './screens/SubmissionSuccessScreen';
import SubmittedPropertiesScreen from './screens/SubmittedPropertiesScreen';

import ReviewAndSubmit from './screens/06_ReviewSubmit/ReviewAndSubmit';
import OnboardingTips from './screens/07_OnboardingTips/OnboardingTips';

const workflows = [
  { name: 'Property Basics', steps: 10, color: 'text-green-600' },
  { name: 'Room Details', steps: 12, color: 'text-teal-600' },
  { name: 'Descriptions', steps: 2, color: 'text-green-500' },
  { name: 'Policies & Rules', steps: 4, color: 'text-green-700' },
  { name: 'Pricing & Availability', steps: 6, color: 'text-teal-500' },
  { name: 'Payments & Taxes', steps: 1, color: 'text-teal-600' },
  { name: 'Review & Submit', steps: 1, color: 'text-teal-700' },
  { name: 'Onboarding Tips', steps: 1, color: 'text-teal-600' },
  { name: 'Form Submission', steps: 1, color: 'text-teal-700' },
  { name: 'Submission Success', steps: 1, color: 'text-green-600' },
  { name: 'Submitted Properties', steps: 1, color: 'text-teal-600' }
];

const ListOfProperty: React.FC = () => {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: '',
    propertyGroup: '',
    propertyName: '',
    location: null,
    streetDetails: null,
    buildingInfo: null,
    roomCount: 1,
    bathroomCount: 1,
    sharedSpaces: [],
    bedType: [],
    bedCount: [],
    roomType: '',
    privateOrShared: '',
    roomSize: 0,
    amenities: [],
    kitchenAmenities: [],
    outdoorFacilities: [],
    photos: [] as Photo[],
    photoOrder: [],
    photoDescriptions: {},
    commonAreas: [],
    // Added missing properties with default values
    title: '',
    description: '',
    highlights: [],
    basePrice: 0,
    currency: 'USD',
    cancellationPolicy: '',
    cleaningFee: 0,
    // Added additional missing fields with defaults
    availabilityData: null,
    discount: 0,
    houseRules: [],
    paymentData: null,
    preferredLanguage: null,
    pricingData: null,
    // Added missing pricing fields
    minimumStay: '',
    maximumStay: '',
    weekendPrice: 0,
    // Added missing description step fields
    descriptionStep1: '',
    descriptionStep2: ''
  });

  const [currentWorkflow, setCurrentWorkflow] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // New form screen state
  const [formValues, setFormValues] = React.useState({
    address: '',
    postalCode: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, setSubmitSuccess] = useState(false);

  const updatePropertyData = (updates: Partial<PropertyData>) => {
    setPropertyData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const totalStepsInWorkflow = workflows[currentWorkflow].steps;
    if (currentStep < totalStepsInWorkflow - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (currentWorkflow < workflows.length - 1) {
      setCurrentWorkflow(prev => prev + 1);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (currentWorkflow > 0) {
      setCurrentWorkflow(prev => prev - 1);
      setCurrentStep(workflows[currentWorkflow - 1].steps - 1);
    }
  };

  // Function to handle submission to backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    console.log('Current propertyData state:', propertyData);
    console.log('Current formValues state:', formValues);

    try {
        // Validate and serialize the data using utility function
        const serializedData = validatePropertyData(propertyData, formValues);
        
        // Log validation summary for debugging
        logValidationSummary(serializedData, propertyData);
        
        // Process photos separately
        const processedPhotos = await processPhotosForUpload(propertyData.photos);
        
        // Prepare the complete property data
        const propertyPayload = {
            ...serializedData,
            photos: processedPhotos
        };

        console.log('Submitting property data:', propertyPayload);

        const { sendPostToServerWithOutToken } = apiService();
        const response = await sendPostToServerWithOutToken('businesses/properties', propertyPayload);

        if (response.returnCode === 200 || response.status === 200) {
            setSubmitSuccess(true);
            setCurrentWorkflow(workflows.length - 2);
            setCurrentStep(0);
        } else {
            throw new Error(response.returnMessage || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        setSubmitError(
            error instanceof Error ? error.message : 'Submission failed. Please try again.'
        );
    } finally {
        setIsSubmitting(false);
    }
};

  const processPhotosForUpload = async (photos: Photo[]) => {
    const processedPhotos = [];
    
    for (const photo of photos) {
      if (photo.file) {
        // Convert file to base64 if needed
        const base64 = await convertFileToBase64(photo.file);
        processedPhotos.push(base64);
      } else if (photo.url) {
        processedPhotos.push(photo.url);
      }
    }
    
    return processedPhotos;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const renderCurrentScreen = () => {
    switch (currentWorkflow) {
      case 0:
        switch (currentStep) {
          case 0: return <PropertyTypeScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 1: return <PropertyGroupScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 2: return <PropertyNameScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 3: return <PropertyLocationScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 4: return <MapLocationConfirmScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 5: return <StreetDetailsScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 6: return <BuildingInfoScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 7: return <RoomCountScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 8: return <BathroomCountScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 9: return <SharedSpacesScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 1:
        switch (currentStep) {
          case 0: return <BedTypeScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 1: return <BedCountScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 2: return <RoomTypeScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 3: return <PrivateOrSharedScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 4: return <RoomSizeScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 5: return <AmenitiesSelectionScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 6: return <KitchenAmenitiesScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 7: return <OutdoorFacilitiesScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 8: return <UploadPhotosScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 9: return <PhotoOrderScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 10: return <PhotoDescriptionScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 11: return <CommonAreasScreen data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 2:
        switch (currentStep) {
          case 0: return <DescriptionStep1 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 1: return <DescriptionStep2 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 2: return <DescriptionStep3 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 3: return <DescriptionStep4 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 4: return <DescriptionStep5 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 5: return <DescriptionStep6 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 6: return <DescriptionStep7 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 7: return <DescriptionStep8 data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 3:
        switch (currentStep) {
          case 0: return <Step1PoliciesRules data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 1: return <Step2PoliciesRules data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 2: return <Step3PoliciesRules data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 3: return <Step4PoliciesRules data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 4:
        switch (currentStep) {
          case 0: return <Step1PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 1: return <Step2PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 2: return <Step3PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 3: return <Step4PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 4: return <Step5PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          case 5: return <Step6PricingAvailability data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 5:
        switch (currentStep) {
          case 0: return <PaymentsAndTaxes data={propertyData} onUpdate={updatePropertyData} onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 6:
        switch (currentStep) {
          case 0: 
            // Map propertyData to the shape expected by ReviewAndSubmit
            const reviewData: {
              propertyType?: string;
              listingType?: 'single' | 'multiple';
              amenities?: string[];
              photos?: { id: number; url: string; file?: File }[];
              description?: {
                title: string;
                desc: string;
                highlights: string[];
              };
              houseRules?: { rule: string; allowed: boolean }[];
              pricing?: {
                basePrice: string;
                currency: string;
                discount: string;
                cleaningFee: string;
                cancellationPolicy: string;
              };
              contactInfo?: {
                address: string;
                postalCode: string;
                contactName: string;
                contactEmail: string;
                contactPhone: string;
              };
            } = {
              propertyType: propertyData.propertyType,
              listingType: 'single',
              amenities: propertyData.amenities,
              photos: propertyData.photos.map(photo => ({
                id: Number(photo.id),
                url: photo.url,
                file: photo.file
              })),
              description: {
                title: propertyData.title || 'N/A',
                desc: propertyData.description || 'N/A',
                highlights: propertyData.highlights && propertyData.highlights.length > 0 
                  ? propertyData.highlights 
                  : ['No highlights specified']
              },
              houseRules: Array.isArray(propertyData.houseRules)
                ? propertyData.houseRules.map(rule => {
                    if (
                      typeof rule === 'object' &&
                      rule !== null &&
                      typeof (rule as any).rule === 'string' &&
                      typeof (rule as any).allowed === 'boolean'
                    ) {
                      return { rule: (rule as any).rule, allowed: (rule as any).allowed };
                    }
                    // fallback for string rules
                    return { rule: String(rule), allowed: true };
                  })
                : [],
              pricing: {
                basePrice: String(propertyData.basePrice || 0),
                currency: propertyData.currency || 'USD',
                discount: String(propertyData.discount || 0),
                cleaningFee: String(propertyData.cleaningFee || 0),
                cancellationPolicy: propertyData.cancellationPolicy || 'No cancellation policy specified'
              },
              contactInfo: {
                address: formValues.address || 'N/A',
                postalCode: formValues.postalCode || 'N/A',
                contactName: formValues.contactName || 'N/A',
                contactEmail: formValues.contactEmail || 'N/A',
                contactPhone: formValues.contactPhone || 'N/A'
              }
            };
            return (
              <ReviewAndSubmit 
                data={reviewData} 
                onNext={nextStep} 
                onPrev={prevStep} 
              />
            );
          default: return null;
        }
      case 7:
        switch (currentStep) {
          case 0: return <OnboardingTips onNext={nextStep} onPrev={prevStep} />;
          default: return null;
        }
      case 8:
        switch (currentStep) {
          case 0: return (
            <FormScreen
              formValues={formValues}
              setFormValues={setFormValues}
              setScreen={(screen) => {
                if (screen === 'success') {
                  setCurrentWorkflow(9);
                  setCurrentStep(0);
                } else {
                  setCurrentWorkflow(8);
                  setCurrentStep(0);
                }
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          );
          default: return null;
        }
      case 9:
        switch (currentStep) {
          case 0: return (
            <SubmissionSuccessScreen
              setScreen={(screen) => {
                if (screen === 'home') {
                  setCurrentWorkflow(0);
                  setCurrentStep(0);
                } else if (screen === 'submittedProperties') {
                  setCurrentWorkflow(10);
                  setCurrentStep(0);
                }
              }}
            />
          );
          default: return null;
        }
      case 10:
        switch (currentStep) {
          case 0: return (
            <SubmittedPropertiesScreen
              setScreen={(screen) => {
                if (screen === 'home') {
                  setCurrentWorkflow(0);
                  setCurrentStep(0);
                }
              }}
            />
          );
          default: return null;
        }
      default:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Coming Soon: {workflows[currentWorkflow].name}
            </h2>
            <p className="text-gray-600 mb-6">Step {currentStep + 1} of {workflows[currentWorkflow].steps}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-400 to-teal-400 overflow-hidden">
      {/* <Background3DAnimation /> */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-end mb-4">
          <button
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow hover:scale-105 transform transition"
            onClick={() => {
              setCurrentWorkflow(10); 
              setCurrentStep(0);
            }}
          >
            Submitted Properties
          </button>
        </div>
        <StepIndicator 
          workflows={workflows}
          currentWorkflow={currentWorkflow}
          currentStep={currentStep}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedWrapper key={`${currentWorkflow}-${currentStep}`}>
            <div className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mt-8 animate-fade-in">
              {renderCurrentScreen()}
            </div>
          </AnimatedWrapper>
        </motion.div>
      </div>
    </div>
  );
};

export default ListOfProperty;

