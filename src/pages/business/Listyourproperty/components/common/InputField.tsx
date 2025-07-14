import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helperText?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  helperText
}, ref) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-green-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 bg-white/80"
        required={required}
      />
      {helperText && (
        <p className="text-sm text-green-600 mt-1">{helperText}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
