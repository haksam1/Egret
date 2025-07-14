import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const BUSINESS_TYPES = [
  { value: '1', label: 'Hotel' },
  { value: '2', label: 'Restaurant' },
  { value: '3', label: 'Resort' },
  { value: '4', label: 'Lodge' },
  { value: '5', label: 'Guest House' },
];

interface BusinessInfoStepProps {
  values: {
    businessTypeId?: string;
    name?: string;
    contactPhone?: string;
    contactEmail?: string;
    description?: string;
  };
  onChange: (field: string, value: any) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  values = {},
  onChange,
  errors = {},
  disabled
}) => (
  <section className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">Business Information</h2>

    <div className="mb-6">
      <label htmlFor="businessTypeId" className="block text-gray-700 mb-2">
        Business Type *
      </label>
      <select
        id="businessTypeId"
        name="businessTypeId"
        value={values.businessTypeId || ''}
        onChange={e => onChange('businessTypeId', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={disabled}
      >
        <option value="">Select Business Type</option>
        {BUSINESS_TYPES.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors.businessTypeId && <p className="text-red-500 text-sm mt-1">{errors.businessTypeId}</p>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2">Business Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name || ''}
          onChange={e => onChange('name', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={disabled}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Contact Phone *</label>
        <PhoneInput
          international
          countryCallingCodeEditable={true}
          defaultCountry={undefined}
          value={values.contactPhone || ''}
          onChange={(value) => onChange('contactPhone', value || '')}
          placeholder="+1234567890"
          disabled={disabled}
          className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.contactPhone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="contactEmail" className="block text-gray-700 mb-2">Contact Email *</label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={values.contactEmail || ''}
          onChange={e => onChange('contactEmail', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={disabled}
        />
        {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
      </div>
    </div>
    <div className="mt-4 mb-2">
      <label htmlFor="description" className="block text-gray-700 mb-2">Description *</label>
      <textarea
        id="description"
        name="description"
        value={values.description || ''}
        onChange={e => onChange('description', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={4}
        disabled={disabled}
      />
      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
    </div>
  </section>
);

export default BusinessInfoStep;