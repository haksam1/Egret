import React from 'react';
import { toast } from 'react-hot-toast';

const RevenueReportsPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Revenue & Reports</h1>
      <p className="text-gray-600 mb-6">View detailed reports on revenue, transactions, and user activity.</p>
      {/* TODO: Add charts/tables for revenue and reports */}
      <div className="text-gray-400 text-center py-12">
        No report data available.
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow"
          onClick={() => toast.success('Demo: Report exported!')}
        >
          Demo Export
        </button>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
