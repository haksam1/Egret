
import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Users } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: string;
  maxParticipants: number;
  price: number;
  location: string;
  available: boolean;
}

const TourManagement: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([
    {
      id: '1',
      name: 'Wildlife Safari',
      description: 'Explore the natural wildlife habitat',
      duration: '3 hours',
      maxParticipants: 8,
      price: 75,
      location: 'National Park',
      available: true
    },
    {
      id: '2',
      name: 'City Walking Tour',
      description: 'Discover the city\'s hidden gems',
      duration: '2 hours',
      maxParticipants: 15,
      price: 35,
      location: 'Downtown',
      available: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Tour
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  tour.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tour.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{tour.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Max {tour.maxParticipants} participants</span>
                </div>
                <div className="font-semibold text-lg text-purple-600">
                  ${tour.price} per person
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

export default TourManagement;
