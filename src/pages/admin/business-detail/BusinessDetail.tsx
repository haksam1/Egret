import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../../services/apiService';
import { Loader2, ArrowLeft, Building } from 'lucide-react';

interface BusinessDetail {
  id: string;
  name: string;
  type?: string;
  contact?: string;
  email?: string;
  phone?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  submitted?: string;
  created_at?: string;
  documents?: number;
  description?: string;
  [key: string]: any;
}

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService().sendPostToServer('admin/businesses', { id });
        const data = (response as any)?.data || (response as any)?.returnObject || [];
        // If backend returns a list, find the business by id
        let found = null;
        if (Array.isArray(data)) {
          found = data.find((b: any) => b.id?.toString() === id);
        } else if (data && typeof data === 'object') {
          found = data;
        }
        setBusiness(found);
      } catch (err) {
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'deactivate') => {
    if (!business) return;
    setActionLoading(action);
    setSuccessMsg(null);
    try {
      let endpoint = '';
      let payload: any = {};
      if (action === 'approve') {
        endpoint = 'admin/approve';
        payload = { id: business.id, businessId: business.id };
      } else if (action === 'reject') {
        endpoint = 'admin/reject';
        payload = { id: business.id, businessId: business.id };
      } else if (action === 'deactivate') {
        endpoint = 'admin/businesses/delete';
        payload = { businessId: business.id };
      }
      await apiService().sendPostToServer(endpoint, payload);
      setSuccessMsg(
        action === 'approve'
          ? 'Business approved successfully.'
          : action === 'reject'
          ? 'Business rejected.'
          : 'Business deactivated.'
      );
      // Optionally update status in UI
      setBusiness((prev) =>
        prev ? { ...prev, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'deactivated' } : prev
      );
    } catch (err) {
      setSuccessMsg('Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="mt-2 text-gray-500">Loading business details...</p>
      </div>
    );
  }
  if (error || !business) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || 'Business not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <Link to="/admin/businesses" className="flex items-center text-green-700 hover:underline mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Approvals
      </Link>
      <div className="flex items-center mb-6">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
          <Building className="h-7 w-7 text-green-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{business.name}</h2>
          {business.type && <div className="text-gray-500 capitalize">{business.type}</div>}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleAction('approve')}
          disabled={actionLoading === 'approve' || business.status === 'approved'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {actionLoading === 'approve' ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : 'Approve'}
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={actionLoading === 'reject' || business.status === 'rejected'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {actionLoading === 'reject' ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : 'Reject'}
        </button>
        <button
          onClick={() => handleAction('deactivate')}
          disabled={actionLoading === 'deactivate' || business.status === 'deactivated'}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {actionLoading === 'deactivate' ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : 'Deactivate'}
        </button>
      </div>
      {successMsg && <div className="mb-4 text-green-600">{successMsg}</div>}
      {/* Info Table */}
      <table className="w-full text-sm mb-4">
        <tbody>
          <tr><td className="font-semibold pr-2">Business Name:</td><td>{business.name}</td></tr>
          {business.type && <tr><td className="font-semibold pr-2">Type:</td><td>{business.type}</td></tr>}
          <tr><td className="font-semibold pr-2">Status:</td><td className="capitalize">{business.status}</td></tr>
          <tr><td className="font-semibold pr-2">Submitted:</td><td>{business.submitted || business.created_at || 'N/A'}</td></tr>
          {(business.phone || business.contact_phone) && <tr><td className="font-semibold pr-2">Phone:</td><td>{business.phone || business.contact_phone}</td></tr>}
          {(business.email || business.contact_email) && <tr><td className="font-semibold pr-2">Email:</td><td>{business.email || business.contact_email}</td></tr>}
          {business.contact && <tr><td className="font-semibold pr-2">Contact Person:</td><td>{business.contact}</td></tr>}
          {business.description && <tr><td className="font-semibold pr-2">Description:</td><td>{business.description}</td></tr>}
          {/* Add more fields as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessDetail;
