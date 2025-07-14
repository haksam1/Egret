export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface AuthResponse {
  storedUser: UserDto;
  token: string;
  user: UserDto;
}

export interface UserDto {
  role: string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  duration: string;
  imageUrl: string;
  category: 'wildlife' | 'adventure' | 'cultural';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  openingHours: string;
  imageUrl: string;
  priceRange: string;
}

export interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  roomType: string;
  activities: string[];
  totalPrice: number;
}

// Generic Response Types
export interface GenericResponse<T = any> {
  user: any;
  storedUser: any;
  token: string;
  returnCode: number;
  returnMessage: string;
  returnData: T;
}

export interface SimpleResponse {
  returnCode: number;
  returnMessage: string;
}