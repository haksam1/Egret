
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

const RestaurantManagement: React.FC = () => {
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herbs',
      price: 28,
      category: 'Main Course',
      available: true
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Classic Caesar with croutons and parmesan',
      price: 15,
      category: 'Appetizer',
      available: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <div key={item.id} className="p-6 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">{item.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${item.price}</span>
                    </div>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium">Monday - Friday</span>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>11:00 AM - 10:00 PM</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium">Saturday - Sunday</span>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
