import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  helperText
}) => {
  return (
    <div className="mb-6">
      <label
        className={`block text-sm font-semibold mb-2 ${
          [
            'Building Type',
            'Elevator Available',
            'Accessibility Features',
            'Parking Available'
          ].includes(label)
            ? 'text-green-600'
            : 'text-[#4b6cb7]'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7158e2] focus:border-transparent transition-all duration-300 bg-white/80"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className="text-sm text-gray-600 mt-1">{helperText}</p>
      )}
    </div>
  );
};
