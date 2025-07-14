import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useUser } from '../../contexts/UserContext';
import BusinessInfoStep from '../AddBusiness/BusinessInfoStep';
import AddressStep from '../AddBusiness/AddressStep';
import BankStep from '../AddBusiness/BankStep';
import ImagesStep from '../AddBusiness/ImagesStep';
import StaffStep from '../AddBusiness/StaffStep';
import { ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

interface RegistrationStepperProps {
  steps: string[];
  currentStep: number;
}

interface StaffMember {
  name: string;
  email: string;
  position: string;
  contactPhone1: string;
  contactPhone2: string;
}

interface BusinessFormData {
  businessTypeId: string;
  name: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  addressType: string;
  regionId: string;
  regionName: string;
  districtId: string;
  districtName: string;
  countyId: string;
  countyName: string;
  subCountyId: string;
  subCountyName: string;
  parishId: string;
  parishName: string;
  village: string;
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountType: string;
  accountNumber?: string;
  swiftCode?: string;
  staffMembers: StaffMember[];
}

const RegistrationStepper: React.FC<RegistrationStepperProps> = ({ steps, currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center 
            ${currentStep === i ? 'bg-green-600 text-white' : 
            i < currentStep ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {i < currentStep ? <FiCheck /> : i + 1}
          </div>
          <span className={`mt-2 text-sm ${currentStep === i ? 'font-medium text-green-600' : 'text-gray-600'}`}>
            {step}
          </span>
        </div>
      ))}
    </div>
    <div className="relative mt-2">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
      <div 
        className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>
    </div>
  </div>
);

const ThankYouStep: React.FC = () => (
  <div className="text-center">
    <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
    <p className="text-gray-700">
      Your business registration has been successfully submitted. Our team will review your submission shortly.
    </p>
    <p className="text-sm text-gray-500 mt-4">You may now navigate back to the homepage.</p>
  </div>
);

const initialValues: BusinessFormData = {
  businessTypeId: '',
  name: '',
  description: '',
  contactPhone: '',
  contactEmail: '',
  addressType: 'PHYSICAL',
  regionId: '',
  regionName: '',
  districtId: '',
  districtName: '',
  countyId: '',
  countyName: '',
  subCountyId: '',
  subCountyName: '',
  parishId: '',
  parishName: '',
  village: '',
  bankName: '',
  bankBranch: '',
  accountName: '',
  accountType: '',
  accountNumber: '',
  swiftCode: '',
  staffMembers: [{
    name: '',
    email: '',
    position: '',
    contactPhone1: '',
    contactPhone2: ''
  }],
};

// Helper to extract only the user ID (string/number) from user object
const getUserId = (user: any) => {
  if (!user) return '';
  if (typeof user.id === 'string' || typeof user.id === 'number') return user.id;
  if (user.id && (typeof user.id.id === 'string' || typeof user.id.id === 'number')) return user.id.id;
  return '';
};

const BusinessRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [formValues, setFormValues] = useState<BusinessFormData>(initialValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const { user } = useUser();
  const navigate = useNavigate();

  const steps = ['Business Info', 'Staff', 'Address', 'Bank Info', 'Images'];

  const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

  const validateStep = (values: BusinessFormData, step: number): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};
    if (step === 0) {
      if (!values.businessTypeId) errors.businessTypeId = 'Business type is required';
      if (!values.name) errors.name = 'Business name is required';
      if (!values.description) errors.description = 'Description is required';
      if (!values.contactPhone) errors.contactPhone = 'Contact phone is required';
      else if (!E164_PHONE_REGEX.test(values.contactPhone)) errors.contactPhone = 'Enter a valid international phone number (e.g. +256764521328)';
      if (!values.contactEmail) errors.contactEmail = 'Contact email is required';
    }
    if (step === 1) {
      if (!values.staffMembers || values.staffMembers.length === 0 || !values.staffMembers[0].name) {
        errors.staffMembers = 'At least one staff member is required';
      } else {
        values.staffMembers.forEach((staff, idx) => {
          if (!staff.name) errors[`staffMembers.${idx}.name`] = 'Name is required';
          if (!staff.email) errors[`staffMembers.${idx}.email`] = 'Email is required';
          if (!staff.position) errors[`staffMembers.${idx}.position`] = 'Position is required';
          if (!staff.contactPhone1) errors[`staffMembers.${idx}.contactPhone1`] = 'Primary phone is required';
          else if (!E164_PHONE_REGEX.test(staff.contactPhone1)) errors[`staffMembers.${idx}.contactPhone1`] = 'Enter a valid international phone number (e.g. +256764521328)';
        });
      }
    }
    if (step === 2) {
      if (!values.regionId) errors.regionId = 'Region is required';
      if (!values.districtId) errors.districtId = 'District is required';
      if (!values.countyId) errors.countyId = 'County is required';
      if (!values.subCountyId) errors.subCountyId = 'Sub-county is required';
      if (!values.parishId) errors.parishId = 'Parish is required';
      if (!values.village) errors.village = 'Village is required';
    }
    if (step === 3) {
      if (!values.bankName) errors.bankName = 'Bank name is required';
      if (!values.bankBranch) errors.bankBranch = 'Bank branch is required';
      if (!values.accountName) errors.accountName = 'Account name is required';
      if (!values.accountType) errors.accountType = 'Account type is required';
    }
    return errors;
  };

  useEffect(() => {
    if (!initialAuthCheckDone && !user) {
      toast.error('Please login to register a business');
      navigate('/login');
    }
    setInitialAuthCheckDone(true);
  }, [user, navigate, initialAuthCheckDone]);

  const nextStep = () => {
    const errors = validateStep(formValues, currentStep);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Helper to sanitize phone numbers to E.164 (removes spaces, keeps only one + and digits)
  function sanitizePhoneNumber(input: string): string {
    if (!input) return '';
    // Remove all non-digit except leading +
    let sanitized = input.replace(/(?!^\+)\D/g, '');
    // Ensure only one leading +
    if (sanitized[0] !== '+') sanitized = '+' + sanitized.replace(/^\+/, '');
    return sanitized;
  }

  const handleFieldChange = (field: string, value: any) => {
    // Sanitize phone fields to E.164
    if (field === 'contactPhone') {
      value = sanitizePhoneNumber(value);
    }
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStaffChange = (staffMembers: StaffMember[]) => {
    // Sanitize staff phone fields to E.164
    const sanitizedStaff = staffMembers.map(staff => ({
      ...staff,
      contactPhone1: sanitizePhoneNumber(staff.contactPhone1),
      contactPhone2: sanitizePhoneNumber(staff.contactPhone2),
    }));
    setFormValues(prev => ({
      ...prev,
      staffMembers: sanitizedStaff,
    }));
  };

  const handleAddressChange = (addressFields: Partial<BusinessFormData>) => {
    setFormValues(prev => ({
      ...prev,
      ...addressFields,
    }));
  };

  const handleSubmit = async () => {
    const { sendPostToServerMult } = apiService();

    if (!user) {
      toast.error('Please login to register a business');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Registering your business...');

      const userId = getUserId(user);

      // Prepare the business data
      // Extract image metadata (for review only, not sent to backend)
      // Backend expects only images as files, not metadata

      // Ensure status is always 'PENDING' on creation
      const fullBusinessDTO = {
        business: {
          businessTypeId: formValues.businessTypeId,
          name: formValues.name,
          description: formValues.description,
          contactPhone: formValues.contactPhone,
          contactEmail: formValues.contactEmail,
          status: 'PENDING', // Always set to PENDING for new business
          createdBy: userId,
          lastUpdatedBy: userId,
        },
        staff: formValues.staffMembers.map((staff) => ({
          contactName: staff.name,
          contactEmail: staff.email,
          contactPosition: staff.position,
          contactPhone1: staff.contactPhone1,
          contactPhone2: staff.contactPhone2,
          createdBy: userId,
          lastUpdatedBy: userId,
        })),
        address: {
          addressType: formValues.addressType,
          regionId: formValues.regionId,
          districtId: formValues.districtId,
          countyId: formValues.countyId,
          subCountyId: formValues.subCountyId,
          parishId: formValues.parishId,
          village: formValues.village,
          createdBy: userId,
          lastUpdatedBy: userId,
        },
        businessBankInformation: {
          bankName: formValues.bankName,
          bankBranch: formValues.bankBranch,
          accountName: formValues.accountName,
          accountType: formValues.accountType,
          swiftCode: formValues.swiftCode,
          createdBy: userId,
          lastUpdatedBy: userId,
        }
      };

      // Remove any undefined/null fields (optional, but helps backend)
      const cleanDTO = JSON.parse(JSON.stringify(fullBusinessDTO));

      // Create FormData with proper structure
      const formData = new FormData();
      formData.append(
        'businessData',
        new Blob([JSON.stringify(cleanDTO)], {
          type: 'application/json'
        }),
        'business_data.json'
      );

      // Add images if present
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
        formData.append('coverImageIndex', coverImageIndex.toString());
      }

      // Make the request using your apiService
      const response = await sendPostToServerMult(
        'businesses/register',
        formData
      ) as { success?: boolean; message?: string };

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create business');
      }

      toast.dismiss(loadingToast);
      toast.success('Business registered successfully!');
      setCurrentStep((prev) => prev + 1);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.dismiss();

      let errorMessage = 'Failed to register business';
      if (error.message?.includes('401')) {
        errorMessage = 'Session expired. Please login again';
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialAuthCheckDone || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        background: "url('/src/backgroundsimages/waterfall.jpg') no-repeat center center fixed",
        backgroundSize: 'cover'
      }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="focus:outline-none inline-block">
          <img
            src="/src/logo/egret other-04.png"
            alt="Egret Hospitality Logo"
            className="h-16 w-auto transition-transform duration-300 hover:scale-105 mx-auto"
          />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-10xl">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-white/30">
          <div className="mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-green-600 hover:text-green-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register Your Business</h2>

          {currentStep < steps.length ? (
            <>
              <RegistrationStepper steps={steps} currentStep={currentStep} />
              <div className="space-y-6">
                {currentStep === 0 && (
                  <BusinessInfoStep
                    values={formValues}
                    onChange={handleFieldChange}
                    errors={formErrors}
                    disabled={isSubmitting}
                  />
                )}

                {currentStep === 1 && (
                  <StaffStep
                    staffMembers={formValues.staffMembers}
                    onChange={handleStaffChange}
                    errors={formErrors}
                    disabled={isSubmitting}
                  />
                )}

                {currentStep === 2 && (
                  <AddressStep
                    values={formValues}
                    onChange={handleAddressChange}
                    errors={formErrors}
                    disabled={isSubmitting}
                  />
                )}

                {currentStep === 3 && (
                  <BankStep
                    values={formValues}
                    onChange={handleFieldChange}
                    errors={formErrors}
                    disabled={isSubmitting}
                  />
                )}

                {currentStep === 4 && (
                  <ImagesStep
                    images={images}
                    setImages={setImages}
                    coverImageIndex={coverImageIndex}
                    setCoverImageIndex={setCoverImageIndex}
                    disabled={isSubmitting}
                  />
                )}

                <div className="flex justify-between mt-8 border-t pt-6">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      <FiChevronLeft className="mr-2" /> Previous
                    </button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto flex items-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      Next <FiChevronRight className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ml-auto flex items-center justify-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Registration
                          <FiCheck className="ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <ThankYouStep />
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;