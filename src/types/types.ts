export type Business = {
  id: number;
  name: string;
  description: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  business_type_id?: number;
  business_type_name?: string;
  contact_email?: string;
  contact_phone?: string;
  owner_name?: string;
  owner_email?: string;
};

export type BusinessModule = {
  id: number;
  name: string;
  description: string;
};

export type BusinessType = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
};

export type Region = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  region_id: number;
};

export type County = {
  id: number;
  name: string;
  district_id: number;
};

export type SubCounty = {
  id: number;
  name: string;
  county_id: number;
};

export type Parish = {
  id: number;
  name: string;
  sub_county_id: number;
};

export type StaffMember = {
  id?: number;
  name: string;
  email: string;
  position: string;
  contact_phone_1: string;
  contact_phone_2: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type Address = {
  id?: number;
  business_id?: number;
  address_type: string;
  region_id: number;
  region_name?: string;
  district_id: number;
  district_name?: string;
  county_id: number;
  county_name?: string;
  sub_county_id: number;
  sub_county_name?: string;
  parish_id: number;
  parish_name?: string;
  village: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type BankInformation = {
  id?: number;
  business_id?: number;
  bank_name: string;
  bank_branch: string;
  account_name: string;
  account_number: string;
  account_type: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type BusinessImage = {
  id?: number;
  business_id?: number;
  image_name?: string;
  is_cover_image?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Amenity = {
  id: number;
  name: string;
  description?: string;
};

export type BusinessAmenity = {
  id?: number;
  business_id: number;
  amenity_id: number;
  amenity_name?: string;
  amenity_description?: string;
  created_at?: string;
};

export type FormData = {
  business_type_id: string;
  name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  staff: StaffMember[];
  address_type: string;
  region_id: string;
  district_id: string;
  county_id: string;
  sub_county_id: string;
  parish_id: string;
  village: string;
  bank_name: string;
  bank_branch: string;
  account_name: string;
  account_number: string;
  account_type: string;
  images: File[];
  cover_image_index: number;
  amenities?: number[];
};

// Utility type for generic API responses
export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  returnObject?: T;
  [key: string]: any;
};