import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Loader2 } from 'lucide-react';

interface ListingDetail {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  owner_name?: string;
  owner_email?: string;
  created_at?: string;
  last_updated_at?: string;
  // Add more fields as needed
}

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await apiService().sendPostToServer<any>('admin/listingDetail', { id });
        if (res?.success && (res.returnObject || res.data)) {
          setListing(res.returnObject || res.data);
        } else {
          setListing(null);
        }
      } catch (err) {
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }
  if (!listing) {
    return <div className="text-center text-gray-500 py-8">Listing not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Listing Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Title:</strong> {listing.title}</div>
        <div><strong>Type:</strong> {listing.type}</div>
        <div><strong>Status:</strong> {listing.status}</div>
        <div><strong>Owner Name:</strong> {listing.owner_name}</div>
        <div><strong>Owner Email:</strong> {listing.owner_email}</div>
        <div><strong>Created At:</strong> {listing.created_at}</div>
        <div><strong>Last Updated:</strong> {listing.last_updated_at}</div>
        {/* Add more fields as needed */}
      </div>
      <div className="mt-8 flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={async () => {
            await apiService().sendPostToServer('admin/approveListing', { listingId: listing.id });
            navigate('/admin/listing-approvals');
          }}
        >
          Approve
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={async () => {
            await apiService().sendPostToServer('admin/rejectListing', { listingId: listing.id });
            navigate('/admin/listing-approvals');
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ListingDetailPage;
