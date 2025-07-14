import React from 'react';

interface Option {
  value: string;
  label: string;
  flag: string;
}

interface SelectDropdownWithFlagsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export const SelectDropdownWithFlags: React.FC<SelectDropdownWithFlagsProps> = ({
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
      <label className="block text-sm font-semibold text-[#4b6cb7] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7158e2] focus:border-transparent transition-all duration-300 bg-white/80 appearance-none"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown with flags requires custom rendering, but native select does not support images in options */}
      </div>
      {helperText && (
        <p className="text-sm text-gray-600 mt-1">{helperText}</p>
      )}
    </div>
  );
};
