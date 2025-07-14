import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, className = '' }) => (
  <div className={`mb-2 ${className}`}>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-gray-800 font-medium">{value || '-'}</p>
  </div>
);

interface StaffMember {
  name: string;
  position: string;
  email: string;
  contact_phone_1: string;
  contact_phone_2?: string;
}

interface BusinessValues {
  business_type_id?: string;
  name?: string;
  contact_phone?: string;
  contact_email?: string;
  status?: string;
  description?: string;
  region_name?: string;
  region_id?: string;
  district_name?: string;
  district_id?: string;
  county_name?: string;
  county_id?: string;
  sub_county_name?: string;
  sub_county_id?: string;
  parish_name?: string;
  parish_id?: string;
  village?: string;
  staffMembers?: StaffMember[];
  amenities?: string[];
  bank_name?: string;
  bank_branch?: string;
  account_name?: string;
  account_type?: string;
}

interface ReviewStepProps {
  values: BusinessValues;
  images: File[];
  coverImageIndex: number;
  error?: string;
}

const BUSINESS_TYPES: Record<string, string> = {
  '1': 'Hotel',
  '2': 'Restaurant',
  '3': 'Resort',
  '4': 'Lodge',
  '5': 'Guest House'
};

const STATUS_OPTIONS: Record<string, string> = {
  'ACTIVE': 'Active',
  'INACTIVE': 'Inactive'
};

const ACCOUNT_TYPES: Record<string, string> = {
  'SAVINGS': 'Savings Account',
  'CHECKING': 'Checking Account',
  'BUSINESS': 'Business Account',
  'FIXED_DEPOSIT': 'Fixed Deposit',
  'CURRENT': 'Current Account'
};

const getDisplayName = (name?: string, id?: string) => {
  if (typeof name === 'string' && name.trim()) return name;
  if (typeof id === 'string' && id.trim()) return `ID: ${id}`;
  return '-';
};

const ReviewStep: React.FC<ReviewStepProps> = ({
  values,
  images,
  coverImageIndex,
  error
}) => {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    const previews = images.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const renderBusinessInfo = () => (
    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
        <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
        Business Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Business Type" value={BUSINESS_TYPES[values.business_type_id || ''] || getDisplayName(undefined, values.business_type_id)} />
        <DetailItem label="Business Name" value={getDisplayName(values.name)} />
        <DetailItem label="Contact Phone" value={getDisplayName(values.contact_phone)} />
        <DetailItem label="Contact Email" value={getDisplayName(values.contact_email)} />
        <DetailItem label="Status" value={STATUS_OPTIONS[values.status || ''] || getDisplayName(undefined, values.status)} />
        <div className="md:col-span-2">
          <DetailItem label="Description" value={getDisplayName(values.description)} />
        </div>
      </div>
    </div>
  );

  const renderStaffMembers = () => {
    if (!values.staffMembers?.length) return null;

    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
          <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
          Staff Members ({values.staffMembers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.staffMembers.map((staff, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-green-700 mb-2">Staff #{index + 1}</h4>
              <DetailItem label="Name" value={getDisplayName(staff.name)} />
              <DetailItem label="Position" value={getDisplayName(staff.position)} />
              <DetailItem label="Email" value={getDisplayName(staff.email)} />
              <DetailItem label="Primary Phone" value={getDisplayName(staff.contact_phone_1)} />
              {staff.contact_phone_2 && staff.contact_phone_2.trim() && (
                <DetailItem label="Secondary Phone" value={getDisplayName(staff.contact_phone_2)} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLocationDetails = () => {
    const hasLocationDetails =
      !!(
        (values.region_name && values.region_name.trim()) ||
        (values.district_name && values.district_name.trim()) ||
        (values.county_name && values.county_name.trim()) ||
        (values.sub_county_name && values.sub_county_name.trim()) ||
        (values.parish_name && values.parish_name.trim()) ||
        (values.village && values.village.trim()) ||
        (values.region_id && values.region_id.trim()) ||
        (values.district_id && values.district_id.trim()) ||
        (values.county_id && values.county_id.trim()) ||
        (values.sub_county_id && values.sub_county_id.trim()) ||
        (values.parish_id && values.parish_id.trim())
      );

    if (!hasLocationDetails) {
      return null;
    }

    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
          <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Region" value={getDisplayName(values.region_name, values.region_id)} />
          <DetailItem label="District" value={getDisplayName(values.district_name, values.district_id)} />
          <DetailItem label="County" value={getDisplayName(values.county_name, values.county_id)} />
          <DetailItem label="Sub-County" value={getDisplayName(values.sub_county_name, values.sub_county_id)} />
          <DetailItem label="Parish" value={getDisplayName(values.parish_name, values.parish_id)} />
          <DetailItem label="Village" value={getDisplayName(values.village)} />
        </div>
      </div>
    );
  };

  const renderBankInfo = () => {
    if (!values.bank_name && !values.bank_branch && !values.account_name && !values.account_type) {
      return null;
    }

    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
          <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Bank Name" value={getDisplayName(values.bank_name)} />
          <DetailItem label="Bank Branch" value={getDisplayName(values.bank_branch)} />
          <DetailItem label="Account Name" value={getDisplayName(values.account_name)} />
          <DetailItem label="Account Type" value={ACCOUNT_TYPES[values.account_type || ''] || getDisplayName(undefined, values.account_type)} />
        </div>
      </div>
    );
  };

  const renderAmenities = () => {
    if (!values.amenities?.length) return null;

    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
          <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
          Amenities ({values.amenities.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {values.amenities.map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessImages = () => {
    if (!images.length) return null;

    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-200 flex items-center">
          <FiCheckCircle className="bg-green-100 text-green-800 p-2 rounded-lg mr-3" size={20} />
          Business Images ({images.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Business ${index}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm border-2 border-gray-100 group-hover:border-green-300 transition-all"
              />
              {coverImageIndex === index && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
                  Cover Image
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Business Details</h2>
        <p className="text-green-600 flex items-center justify-center">
          <FiCheckCircle className="mr-2" />
          Please verify all information before submitting
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        {renderBusinessInfo()}
        {renderStaffMembers()}
        {renderLocationDetails()}
        {renderBankInfo()}
        {renderAmenities()}
        {renderBusinessImages()}
      </div>
    </div>
  );
};

export default ReviewStep;