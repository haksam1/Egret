import React from 'react';

const RevenueReportsPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Revenue & Reports</h1>
      <p className="text-gray-600 mb-6">View detailed reports on revenue, transactions, and user activity.</p>
      {/* TODO: Add charts/tables for revenue and reports */}
      <div className="text-gray-400 text-center py-12">No report data available.</div>
    </div>
  );
};

export default RevenueReportsPage;
