import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BusinessDashboard from '../pages/business/Dashboard';
import BusinessBookings from '../pages/business/Bookings';
import BusinessProfile from '../pages/business/Profile';
import BusinessSettings from '../pages/business/Settings';
import BusinessRegistration from '../pages/business/BusinessRegistration';

const BusinessRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="register" element={<BusinessRegistration />} />
      <Route path="dashboard" element={<BusinessDashboard />} />
      <Route path="bookings" element={<BusinessBookings />} />
      <Route path="profile" element={<BusinessProfile />} />
      <Route path="settings" element={<BusinessSettings />} />
      <Route path="*" element={<Navigate to="/business/dashboard" replace />} />
    </Routes>
  );
};

export default BusinessRoutes; 