/**
 * Data Validation Utilities
 * 
 * These helper functions ensure that data is properly formatted before sending to the backend,
 * preventing JSON parsing errors like "Failed to parse map value: allll, error: illegal input"
 */

/**
 * Ensures a value is a valid object
 * @param value - The value to validate
 * @param defaultValue - Default object to return if value is invalid
 * @returns A valid object
 */
export const ensureObject = (value: any, defaultValue: any = {}): any => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      // Try to parse if it's a JSON string
      return JSON.parse(value);
    } catch {
      // If it's not JSON, create a simple object
      return { value };
    }
  }
  return defaultValue;
};

/**
 * Ensures a value is a valid array
 * @param value - The value to validate
 * @param defaultValue - Default array to return if value is invalid
 * @returns A valid array
 */
export const ensureArray = (value: any, defaultValue: any[] = []): any[] => {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Handle comma-separated strings
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    // Single value as array
    return [value];
  }
  return defaultValue;
};

/**
 * Ensures a value is a valid number
 * @param value - The value to validate
 * @param defaultValue - Default number to return if value is invalid
 * @returns A valid number
 */
export const ensureNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Ensures a value is a valid string
 * @param value - The value to validate
 * @param defaultValue - Default string to return if value is invalid
 * @returns A valid string
 */
export const ensureString = (value: any, defaultValue: string = ''): string => {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

/**
 * Ensures a value is a valid boolean
 * @param value - The value to validate
 * @param defaultValue - Default boolean to return if value is invalid
 * @returns A valid boolean
 */
export const ensureBoolean = (value: any, defaultValue: boolean = false): boolean => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') return true;
    if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return defaultValue;
};

/**
 * Validates and formats property data for backend submission
 * @param data - The property data to validate
 * @param formData - Additional form data
 * @returns Properly formatted property data
 */
export const validatePropertyData = (data: any, formData: any = {}) => {
  return {
    // Object fields
    location: ensureObject(data.location, { country: '', city: '' }),
    streetDetails: ensureObject(data.streetDetails, { 
      streetAddress: '', 
      apartmentNumber: '', 
      landmark: '', 
      accessInstructions: '' 
    }),
    buildingInfo: ensureObject(data.buildingInfo, {
      buildingType: '',
      buildingName: '',
      yearBuilt: '',
      floor: '',
      elevator: '',
      parking: '',
      accessibility: ''
    }),
    photoDescriptions: ensureObject(data.photoDescriptions, {}),

    // Array fields
    sharedSpaces: ensureArray(data.sharedSpaces),
    bedType: ensureArray(data.bedType),
    bedCount: ensureArray(data.bedCount).map(Number).filter(num => !isNaN(num)),
    amenities: ensureArray(data.amenities),
    kitchenAmenities: ensureArray(data.kitchenAmenities),
    outdoorFacilities: ensureArray(data.outdoorFacilities),
    commonAreas: ensureArray(data.commonAreas),
    highlights: ensureArray(data.highlights),
    photoOrder: ensureArray(data.photoOrder),

    // Number fields
    roomCount: ensureNumber(data.roomCount, 1),
    bathroomCount: ensureNumber(data.bathroomCount, 1),
    roomSize: ensureNumber(data.roomSize),
    basePrice: ensureNumber(data.basePrice),
    discount: ensureNumber(data.discount, 0),
    cleaningFee: ensureNumber(data.cleaningFee, 0),
    weekendPrice: ensureNumber(data.weekendPrice, 0),

    // String fields
    propertyType: ensureString(data.propertyType),
    propertyGroup: ensureString(data.propertyGroup),
    propertyName: ensureString(data.propertyName),
    roomType: ensureString(data.roomType),
    privateOrShared: ensureString(data.privateOrShared),
    title: ensureString(data.title),
    description: ensureString(data.description),
    currency: ensureString(data.currency, 'USD'),
    cancellationPolicy: ensureString(data.cancellationPolicy),
    minimumStay: ensureString(data.minimumStay),
    maximumStay: ensureString(data.maximumStay),

    // Complex object fields
    houseRules: ensureArray(data.houseRules).map(rule => {
      if (typeof rule === 'object' && rule !== null) {
        return {
          rule: ensureString(rule.rule || rule),
          allowed: ensureBoolean(rule.allowed, true)
        };
      }
      return { rule: ensureString(rule), allowed: true };
    }),

    // Additional data
    availabilityData: ensureObject(data.availabilityData, null),
    paymentData: ensureObject(data.paymentData, null),
    pricingData: ensureObject(data.pricingData, null),
    preferredLanguage: ensureString(data.preferredLanguage, null),

    // Contact information
    address: ensureString(formData.address),
    postalCode: ensureString(formData.postalCode),
    contactName: ensureString(formData.contactName),
    contactEmail: ensureString(formData.contactEmail),
    contactPhone: ensureString(formData.contactPhone)
  };
};

/**
 * Validates a specific field based on its expected type
 * @param fieldName - Name of the field for error reporting
 * @param value - The value to validate
 * @param expectedType - Expected type ('object', 'array', 'number', 'string', 'boolean')
 * @param defaultValue - Default value if validation fails
 * @returns Validated value
 */
export const validateField = (
  fieldName: string, 
  value: any, 
  expectedType: 'object' | 'array' | 'number' | 'string' | 'boolean',
  defaultValue: any
) => {
  let validatedValue;
  
  switch (expectedType) {
    case 'object':
      validatedValue = ensureObject(value, defaultValue);
      break;
    case 'array':
      validatedValue = ensureArray(value, defaultValue);
      break;
    case 'number':
      validatedValue = ensureNumber(value, defaultValue);
      break;
    case 'string':
      validatedValue = ensureString(value, defaultValue);
      break;
    case 'boolean':
      validatedValue = ensureBoolean(value, defaultValue);
      break;
    default:
      validatedValue = defaultValue;
  }

  // Log validation warnings in development
  if (process.env.NODE_ENV === 'development' && value !== validatedValue) {
    console.warn(`Field "${fieldName}" was corrected from ${typeof value} to ${expectedType}:`, {
      original: value,
      corrected: validatedValue
    });
  }

  return validatedValue;
};

/**
 * Logs data validation summary for debugging
 * @param data - The data that was validated
 * @param originalData - The original data before validation
 */
export const logValidationSummary = (data: any, originalData: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Data Validation Summary');
    console.log('Original data:', originalData);
    console.log('Validated data:', data);
    
    // Check for potential issues
    const issues = [];
    
    Object.keys(data).forEach(key => {
      const original = originalData[key];
      const validated = data[key];
      
      if (original !== validated) {
        issues.push({
          field: key,
          original: original,
          validated: validated,
          originalType: typeof original,
          validatedType: typeof validated
        });
      }
    });
    
    if (issues.length > 0) {
      console.warn('Validation corrections made:', issues);
    } else {
      console.log('✅ All data validated successfully');
    }
    
    console.groupEnd();
  }
}; 