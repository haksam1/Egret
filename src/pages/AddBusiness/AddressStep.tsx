import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

interface AddressItem {
  id: string;
  name: string;
  parentId?: string;
}
interface AddressStepProps {
  values: any;
  onChange: (fields: Partial<any>) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}

const AddressStep: React.FC<AddressStepProps> = ({ values, onChange, errors, disabled }) => {
  const [addressData, setAddressData] = useState({
    regions: [] as AddressItem[],
    districts: [] as AddressItem[],
    counties: [] as AddressItem[],
    subCounties: [] as AddressItem[],
    parishes: [] as AddressItem[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddressHierarchy = async () => {
      try {
        setLoading(true);
        setError(null);

        const { sendGetToServer } = apiService();
        const response = await sendGetToServer('address/getaddress');

        if (!response) {
          throw new Error('Failed to fetch address data');
        }

        setAddressData({
          regions: response.regions.map((region: any) => ({
            id: region.id,
            name: region.description,
          })),
          districts: response.districts.map((district: any) => ({
            id: district.id,
            name: district.district_name,
            parentId: district.parentId,
          })),
          counties: response.counties.map((county: any) => ({
            id: county.id,
            name: county.county_name,
            parentId: county.parentId,
          })),
          subCounties: response.subCounties.map((subCounty: any) => ({
            id: subCounty.id,
            name: subCounty.sub_county_name,
            parentId: subCounty.parentId,
          })),
          parishes: response.parishes.map((parish: any) => ({
            id: parish.id,
            name: parish.parish_name,
            parentId: parish.parentId,
          })),
        });
      } catch (error: any) {
        console.error('Error fetching address hierarchy:', error);
        setError(error.message || 'Failed to load address data');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressHierarchy();
  }, []);

  const handleFieldChange = (field: string, value: string, options: AddressItem[]) => {
    const nameField = `${field.replace('Id', 'Name')}`;
    const selectedItem = options.find(item => item.id === value);
    const patch: any = { [field]: value, [nameField]: selectedItem?.name || '' };

    const dependentFieldsMap: Record<string, string[]> = {
      regionId: ['districtId', 'districtName', 'countyId', 'countyName', 'subCountyId', 'subCountyName', 'parishId', 'parishName'],
      districtId: ['countyId', 'countyName', 'subCountyId', 'subCountyName', 'parishId', 'parishName'],
      countyId: ['subCountyId', 'subCountyName', 'parishId', 'parishName'],
      subCountyId: ['parishId', 'parishName'],
      parishId: [],
      village: [],
    };
    (dependentFieldsMap[field] || []).forEach(dep => {
      patch[dep] = '';
    });
    onChange(patch);
  };

  const renderSelectField = (
    field: string,
    label: string,
    options: AddressItem[],
    disabledSelect: boolean,
    loadingMessage?: string
  ) => (
    <div className="mb-4">
      <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <select
        id={field}
        name={field}
        value={values[field] || ''}
        onChange={e => handleFieldChange(field, e.target.value, options)}
        className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={disabled || disabledSelect || loading}
        aria-describedby={`${field}-error`}
      >
        <option value="">
          {loadingMessage || (disabledSelect ? `Select ${label} first` : `Select ${label}`)}
        </option>
        {options.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p id={`${field}-error`} className="mt-1 text-sm text-red-600">
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Address Information</h2>
      {error && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelectField('regionId', 'Region', addressData.regions, false, loading ? 'Loading regions...' : undefined)}
        {renderSelectField(
          'districtId',
          'District',
          addressData.districts.filter(d => d.parentId?.toString() === values.regionId?.toString()),
          !values.regionId
        )}
        {renderSelectField(
          'countyId',
          'County',
          addressData.counties.filter(c => c.parentId?.toString() === values.districtId?.toString()),
          !values.districtId
        )}
        {renderSelectField(
          'subCountyId',
          'Sub-County',
          addressData.subCounties.filter(sc => sc.parentId?.toString() === values.countyId?.toString()),
          !values.countyId
        )}
        {renderSelectField(
          'parishId',
          'Parish',
          addressData.parishes.filter(p => p.parentId?.toString() === values.subCountyId?.toString()),
          !values.subCountyId
        )}
        <div className="mb-4 md:col-span-2">
          <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
            Village *
          </label>
          <input
            id="village"
            name="village"
            type="text"
            value={values.village}
            onChange={e => onChange({ village: e.target.value })}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.village ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter village name"
            aria-describedby="village-error"
            disabled={disabled}
          />
          {errors.village && (
            <p id="village-error" className="mt-1 text-sm text-red-600">
              {errors.village}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressStep;