# Property Data Validation and Serialization Guide

## Overview

This guide explains the data validation and serialization fixes implemented to prevent backend JSON parsing errors like `Failed to parse map value: allll, error: illegal input， offset 1, char a`.

## Problem

The backend expects specific data types for object and array fields, but the frontend was sometimes sending:
- String values instead of objects for fields like `location`, `streetDetails`, `buildingInfo`
- Comma-separated strings instead of arrays for fields like `bedType`, `amenities`
- Invalid JSON strings that couldn't be parsed

## Solution

### 1. Data Validation Functions

The `validateAndSerializePropertyData` function in `ListOfProperty.tsx` ensures all data is properly formatted before submission:

```typescript
const validateAndSerializePropertyData = (data: PropertyData, formData: any) => {
  // Helper functions to ensure proper data types
  const ensureObject = (value: any, defaultValue: any = {}) => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return { value };
      }
    }
    return defaultValue;
  };

  const ensureArray = (value: any, defaultValue: any[] = []) => {
    if (value === null || value === undefined) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      if (value.includes(',')) {
        return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }
      return [value];
    }
    return defaultValue;
  };

  const ensureNumber = (value: any, defaultValue: number = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const ensureString = (value: any, defaultValue: string = '') => {
    if (value === null || value === undefined) return defaultValue;
    return String(value);
  };

  // Return properly formatted data
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
          allowed: typeof rule.allowed === 'boolean' ? rule.allowed : true
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
```

### 2. Updated handleSubmit Function

The `handleSubmit` function now uses the validation function:

```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(false);

  try {
    // Validate and serialize the data first
    const serializedData = validateAndSerializePropertyData(propertyData, formValues);
    
    // Process photos separately
    const processedPhotos = await processPhotosForUpload(propertyData.photos);
    
    // Prepare the complete property data
    const propertyPayload = {
      ...serializedData,
      photos: processedPhotos
    };

    console.log('Submitting property data:', propertyPayload);

    const { sendPostToServerWithOutToken } = apiService();
    const response = await sendPostToServerWithOutToken('businesses/properties', propertyPayload);

    if (response.returnCode === 200 || response.status === 200) {
      setSubmitSuccess(true);
      setCurrentWorkflow(workflows.length - 2);
      setCurrentStep(0);
    } else {
      throw new Error(response.returnMessage || 'Submission failed');
    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitError(
      error instanceof Error ? error.message : 'Submission failed. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};
```

## Data Type Expectations

### Object Fields (must be objects, not strings)
```typescript
// ✅ Correct
location: { country: "US", city: "New York" }
streetDetails: { streetAddress: "123 Main St", apartmentNumber: "Apt 4B" }
buildingInfo: { buildingType: "apartment", buildingName: "Sunset Towers" }
photoDescriptions: { "photo1.jpg": "Living room", "photo2.jpg": "Bedroom" }

// ❌ Incorrect
location: "New York"
streetDetails: "123 Main St"
buildingInfo: "apartment"
photoDescriptions: "Living room, Bedroom"
```

### Array Fields (must be arrays, not strings)
```typescript
// ✅ Correct
bedType: ["Single", "Double"]
amenities: ["WiFi", "Kitchen", "Parking"]
sharedSpaces: ["Living Room", "Kitchen"]
highlights: ["Great location", "Modern amenities"]

// ❌ Incorrect
bedType: "Single,Double"
amenities: "WiFi,Kitchen,Parking"
sharedSpaces: "Living Room, Kitchen"
highlights: "Great location, Modern amenities"
```

### Number Fields (must be numbers, not strings)
```typescript
// ✅ Correct
roomCount: 2
bathroomCount: 1
basePrice: 150
cleaningFee: 50

// ❌ Incorrect
roomCount: "2"
bathroomCount: "1"
basePrice: "150"
cleaningFee: "50"
```

## Best Practices for Form Components

### 1. Always use proper data structures in form components:

```typescript
// ✅ Good: Update object fields as objects
const handleLocationChange = (field: string, value: string) => {
  const updatedLocation = { ...location, [field]: value };
  setLocation(updatedLocation);
  onUpdate({ location: updatedLocation });
};

// ✅ Good: Update array fields as arrays
const handleAmenitiesChange = (amenity: string, isSelected: boolean) => {
  const updatedAmenities = isSelected 
    ? [...amenities, amenity]
    : amenities.filter(a => a !== amenity);
  onUpdate({ amenities: updatedAmenities });
};
```

### 2. Validate data before updating state:

```typescript
// ✅ Good: Validate before updating
const handleBedTypeChange = (bedType: string) => {
  if (typeof bedType === 'string' && bedType.trim()) {
    const updatedBedTypes = Array.isArray(data.bedType) 
      ? [...data.bedType, bedType]
      : [bedType];
    onUpdate({ bedType: updatedBedTypes });
  }
};
```

### 3. Use proper default values:

```typescript
// ✅ Good: Proper defaults
const [location, setLocation] = useState(data.location || {
  country: '',
  city: ''
});

const [amenities, setAmenities] = useState(data.amenities || []);
```

## Testing the Fix

### 1. Console Logging
The validation function logs the processed data before submission:
```typescript
console.log('Submitting property data:', propertyPayload);
```

### 2. Data Validation Checklist
Before submitting, ensure:
- [ ] All object fields are actual objects, not strings
- [ ] All array fields are actual arrays, not strings
- [ ] All number fields are numbers, not strings
- [ ] No undefined or null values that could cause parsing issues
- [ ] Photo descriptions are properly formatted as objects
- [ ] House rules are properly formatted as array of objects

### 3. Common Issues to Watch For
- Form components that accidentally convert objects to strings
- Input fields that send comma-separated values instead of arrays
- Number inputs that send string values
- Missing validation for required object/array fields

## Additional Utilities

### Validation Helper Functions
You can use these helper functions in other components:

```typescript
// Ensure a value is an object
export const ensureObject = (value: any, defaultValue: any = {}) => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return { value };
    }
  }
  return defaultValue;
};

// Ensure a value is an array
export const ensureArray = (value: any, defaultValue: any[] = []) => {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [value];
  }
  return defaultValue;
};

// Ensure a value is a number
export const ensureNumber = (value: any, defaultValue: number = 0) => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};
```

## Conclusion

This validation system ensures that all data sent to the backend is properly formatted, preventing JSON parsing errors and ensuring smooth backend processing. Always use the validation functions when handling form data and ensure your form components maintain proper data structures throughout the user interaction flow. 