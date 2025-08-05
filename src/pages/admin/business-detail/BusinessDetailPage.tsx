import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../../services/apiService';
import { toast } from 'react-hot-toast';

interface Business {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  status?: string;
  created_at: string;
  last_updated_at?: string;
  business_type_id?: string;
  owner_name?: string;
  owner_email?: string;
}

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      try { 
        const res = await apiService().sendGetToServer<{ returnObject?: Business; data?: Business }>(`businesses/business-detail`, { id });
        const b = res?.returnObject || res?.data;
        if (b) setBusiness(b);
        else toast.error('Business not found');
      } catch (err) {
        toast.error('Failed to fetch business details');
      } finally {
        setLoading(false);
      }
    };    fetchBusiness();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'update') => {
    try {
      let payload: any = { id };
      if (action === 'update' && business) {
        // Only include name if updating and business exists
        payload = { ...payload, name: business.name + ' (Updated)' };
      }
      // Map action to correct endpoint
      const endpoint = action === 'approve' ? 'admin/approve'
                      : action === 'reject' ? 'admin/reject'
                      : action === 'update' ? 'admin/update'
                      : '';
      const res = await apiService().sendPostToServer<{ success?: boolean; message?: string }>(endpoint, payload);
      if (res?.success) {
        toast.success(res?.message || `Business ${action}d successfully`);
        if (action !== 'update') navigate('/admin/businesses');
        else if (business) setBusiness({ ...business, name: business.name + ' (Updated)' });
      } else {
        toast.error(res?.message || `Failed to ${action} business`);
      }
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${action} business`);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <div className="text-gray-600 text-lg">Loading business details...</div>
      </div>
    </div>
  );
  if (!business) return <div className="p-8 text-center text-red-500">Business not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <span>Business Details</span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">ID: {business.id}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-3"><span className="font-semibold">Name:</span> {business.name}</div>
          <div className="mb-3"><span className="font-semibold">Contact Email:</span> {business.contact_email}</div>
          <div className="mb-3"><span className="font-semibold">Contact Phone:</span> {business.contact_phone}</div>
          <div className="mb-3"><span className="font-semibold">Owner Name:</span> {business.owner_name || '-'}</div>
          <div className="mb-3"><span className="font-semibold">Owner Email:</span> {business.owner_email || '-'}</div>
        </div>
        <div>
          <div className="mb-3"><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-white ${business.status === 'APPROVED' ? 'bg-green-600' : business.status === 'REJECTED' ? 'bg-red-600' : 'bg-yellow-500'}`}>{business.status}</span></div>
          <div className="mb-3"><span className="font-semibold">Created At:</span> {business.created_at}</div>
          <div className="mb-3"><span className="font-semibold">Last Updated:</span> {business.last_updated_at || '-'}</div>
          <div className="mb-3"><span className="font-semibold">Business Type ID:</span> {business.business_type_id || '-'}</div>
        </div>
      </div>
      <div className="mb-8">
        <div className="font-semibold mb-2">Description:</div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 text-gray-700">{business.description}</div>
      </div>
      <div className="flex gap-4 mt-8 justify-end">
        <button
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 font-semibold shadow"
          onClick={() => handleAction('approve')}
        >
          Approve
        </button>
        <button
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 font-semibold shadow"
          onClick={() => handleAction('reject')}
        >
          Reject
        </button>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-semibold shadow"
          onClick={() => handleAction('update')}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
