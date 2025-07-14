
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, DollarSign, Calendar, TrendingUp, Bell } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useUser } from '../../contexts/UserContext';

const BusinessDashboard: React.FC = () => {
  const { business } = useBusiness();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    // Fetch business statistics
    const fetchStats = async () => {
      // Mock data - replace with actual API call
      setStats({
        totalBookings: 156,
        totalRevenue: 45320,
        activeListings: 12,
        pendingRequests: 8
      });
    };
    fetchStats();
  }, []);

  const businessName = business?.businessName || business?.name || 'Your Business';
  const availableModules = business?.modules || ['hotel', 'restaurant', 'tour'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{businessName}</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.firstName || 'Business Owner'}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableModules.includes('hotel') && (
            <Link
              to="/business/hotel"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Building2 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotel Management</h3>
              <p className="text-gray-600">Manage rooms, bookings, and hotel operations</p>
            </Link>
          )}

          {availableModules.includes('restaurant') && (
            <Link
              to="/business/restaurant"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Management</h3>
              <p className="text-gray-600">Handle reservations, menu, and dining services</p>
            </Link>
          )}

          {availableModules.includes('tour') && (
            <Link
              to="/business/tour"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tour Management</h3>
              <p className="text-gray-600">Organize tours, activities, and experiences</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
