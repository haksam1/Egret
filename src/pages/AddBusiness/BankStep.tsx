import React, { useState } from 'react';

const accountTypes = [
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CHECKING', label: 'Checking Account' },
  { value: 'BUSINESS', label: 'Business Account' },
  { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit' },
  { value: 'CURRENT', label: 'Current Account' },
];

// Uganda banks with their major branches
const ugandaBanksWithBranches = {
  'Centenary Bank': ['Kampala Road', 'Garden City', 'Nakawa', 'Ntinda', 'Makerere'],
  'Stanbic Bank Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Oasis Mall', 'Equatorial Mall'],
  'Standard Chartered Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Kololo', 'Nakawa'],
  'Absa Bank Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Ntinda', 'Bugolobi'],
  'DFCU Bank': ['Main Branch', 'Garden City', 'Acacia Mall', 'Nakawa', 'Ntinda'],
  'Bank of Africa Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Ntinda', 'Bugolobi'],
  'Equity Bank Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Nakawa', 'Ntinda'],
  'Ecobank Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Nakawa', 'Ntinda'],
  'Housing Finance Bank': ['Main Branch', 'Garden City', 'Acacia Mall', 'Nakawa', 'Ntinda'],
  'NC Bank Uganda': ['Main Branch', 'Garden City', 'Acacia Mall', 'Nakawa', 'Ntinda']
};

const BankStep: React.FC<{
  values: any;
  onChange: (field: string, value: any) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}> = ({ values, onChange, errors, disabled }) => {
  const [branches, setBranches] = useState<string[]>([]);

  const handleBankChange = (bankName: string) => {
    onChange('bankName', bankName);
    // Reset branch when bank changes
    onChange('bankBranch', '');
    // Set branches for the selected bank
    setBranches(ugandaBanksWithBranches[bankName as keyof typeof ugandaBanksWithBranches] || []);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bank Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <select
            id="bankName"
            name="bankName"
            value={values.bankName}
            onChange={(e) => handleBankChange(e.target.value)}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.bankName ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby="bankName-error"
            disabled={disabled}
          >
            <option value="">Select bank</option>
            {Object.keys(ugandaBanksWithBranches).map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && (
            <p id="bankName-error" className="mt-1 text-sm text-red-600">
              {errors.bankName}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Branch *
          </label>
          {values.bankName ? (
            <select
              id="bankBranch"
              name="bankBranch"
              value={values.bankBranch}
              onChange={(e) => onChange('bankBranch', e.target.value)}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.bankBranch ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby="bankBranch-error"
              disabled={disabled}
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={values.bankBranch}
              disabled
              className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Select bank first"
            />
          )}
          {errors.bankBranch && (
            <p id="bankBranch-error" className="mt-1 text-sm text-red-600">
              {errors.bankBranch}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            id="accountName"
            name="accountName"
            value={values.accountName}
            onChange={(e) => onChange('accountName', e.target.value)}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.accountName ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby="accountName-error"
            disabled={disabled}
            placeholder="Enter account name"
          />
          {errors.accountName && (
            <p id="accountName-error" className="mt-1 text-sm text-red-600">
              {errors.accountName}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number *
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={values.accountNumber}
            onChange={(e) => onChange('accountNumber', e.target.value)}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.accountNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby="accountNumber-error"
            disabled={disabled}
            maxLength={50}
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <p id="accountNumber-error" className="mt-1 text-sm text-red-600">
              {errors.accountNumber}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
            Account Type *
          </label>
          <select
            id="accountType"
            name="accountType"
            value={values.accountType}
            onChange={(e) => onChange('accountType', e.target.value)}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.accountType ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby="accountType-error"
            disabled={disabled}
          >
            <option value="">Select account type</option>
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.accountType && (
            <p id="accountType-error" className="mt-1 text-sm text-red-600">
              {errors.accountType}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankStep;