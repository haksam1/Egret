import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface StaffMember {
  name: string;
  email: string;
  position: string;
  contactPhone1: string;
  contactPhone2: string;
}

interface StaffStepProps {
  staffMembers: StaffMember[];
  onChange: (staff: StaffMember[]) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}

const emptyStaff: StaffMember = {
  name: '',
  email: '',
  position: '',
  contactPhone1: '',
  contactPhone2: '',
};

const StaffStep: React.FC<StaffStepProps> = ({
  staffMembers,
  onChange,
  errors,
  disabled,
}) => {
  const handleMemberChange = (index: number, field: keyof StaffMember, value: string) => {
    const updated = [...staffMembers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addMember = () => {
    onChange([...staffMembers, { ...emptyStaff }]);
  };

  const removeMember = (index: number) => {
    const updated = [...staffMembers];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Staff Information</h2>
      <div className="space-y-4">
        {staffMembers.map((member, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Staff Member #{index + 1}</h3>
              {staffMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="text-red-600 hover:text-red-800 flex items-center transition-colors"
                  aria-label={`Remove staff member ${index + 1}`}
                  disabled={disabled}
                >
                  <FiTrash2 className="mr-1.5" />
                  <span className="text-sm">Remove</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={member.name}
                  onChange={e => handleMemberChange(index, 'name', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={disabled}
                />
                {errors[`staffMembers.${index}.name`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`staffMembers.${index}.name`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={member.email}
                  onChange={e => handleMemberChange(index, 'email', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={disabled}
                />
                {errors[`staffMembers.${index}.email`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`staffMembers.${index}.email`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  value={member.position}
                  onChange={e => handleMemberChange(index, 'position', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={disabled}
                />
                {errors[`staffMembers.${index}.position`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`staffMembers.${index}.position`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone *</label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={true}
                  defaultCountry={undefined}
                  value={member.contactPhone1}
                  onChange={(value) => handleMemberChange(index, 'contactPhone1', value || '')}
                  placeholder="+1234567890"
                  disabled={disabled}
                  className={`w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors[`staffMembers.${index}.contactPhone1`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`staffMembers.${index}.contactPhone1`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`staffMembers.${index}.contactPhone1`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={true}
                  defaultCountry={undefined}
                  value={member.contactPhone2}
                  onChange={(value) => handleMemberChange(index, 'contactPhone2', value || '')}
                  placeholder="+1234567890"
                  disabled={disabled}
                  className={`w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors[`staffMembers.${index}.contactPhone2`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`staffMembers.${index}.contactPhone2`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`staffMembers.${index}.contactPhone2`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMember}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={disabled}
        >
          <FiPlus className="mr-2" />
          Add Staff Member
        </button>
      </div>
    </section>
  );
};

export default StaffStep;