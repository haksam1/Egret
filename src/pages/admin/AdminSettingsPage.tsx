import React from 'react';
import { toast } from 'react-hot-toast';

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Admin Settings</h1>
      <p className="text-gray-600 mb-6">Manage site configuration, roles, notifications, and payment settings.</p>
      {/* TODO: Add settings forms and controls */}
      <div className="text-gray-400 text-center py-12">
        Settings coming soon.
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow"
          onClick={() => toast.success('Settings saved (demo toast)!')}
        >
          Demo Save
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
