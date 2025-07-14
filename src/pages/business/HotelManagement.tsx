
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Bed, Users } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

const HotelManagement: React.FC = () => {
  const [rooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Deluxe Ocean View',
      type: 'Deluxe',
      capacity: 2,
      price: 150,
      amenities: ['Ocean View', 'Balcony', 'WiFi', 'AC'],
      status: 'available'
    },
    {
      id: '2',
      name: 'Standard Room',
      type: 'Standard',
      capacity: 2,
      price: 100,
      amenities: ['WiFi', 'AC', 'TV'],
      status: 'occupied'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  room.status === 'available' ? 'bg-green-100 text-green-800' :
                  room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {room.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Bed className="h-4 w-4 mr-2" />
                  <span>{room.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <div className="font-semibold text-lg text-blue-600">
                  ${room.price}/night
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelManagement;
