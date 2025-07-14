import React, { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, User, Mail, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  owner?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted?: string;
  documents?: number;
}

const ListingApprovalsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await apiService().sendPostToServer('admin/listings/pending', {});
        const listingsData = (response as any)?.data || (response as any)?.returnObject || [];
        if (!Array.isArray(listingsData)) throw new Error('Invalid listings data format');
        setListings(listingsData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const searchLower = searchTerm.toLowerCase();
    return (
      listing.title.toLowerCase().includes(searchLower) ||
      listing.owner?.toLowerCase().includes(searchLower) ||
      listing.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(`approve-${id}`);
      await apiService().sendPostToServer('admin/listings/approve', { id });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
      toast.success('Listing approved successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve listing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(`reject-${id}`);
      await apiService().sendPostToServer('admin/listings/reject', { id });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
      toast.success('Listing rejected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject listing');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3 mr-1" />;
      case 'approved': return <Check className="h-3 w-3 mr-1" />;
      case 'rejected': return <X className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Listing Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve or reject pending listings</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search listings by title, owner, or email..."
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Owner', 'Submitted', 'Documents', 'Status', 'Actions'].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading listings...</p>
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No listings match your search' : 'No pending listings found'}
                  </td>
                </tr>
              ) : (
                filteredListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        {listing.owner}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {listing.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(listing.submitted || '')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{listing.documents} {listing.documents === 1 ? 'file' : 'files'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(listing.status)}`}>{getStatusIcon(listing.status)}{listing.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(listing.id)}
                              disabled={actionLoading === `approve-${listing.id}`}
                              className={`text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 ${actionLoading === `approve-${listing.id}` ? 'opacity-50' : ''}`}
                            >
                              {actionLoading === `approve-${listing.id}` ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(listing.id)}
                              disabled={actionLoading === `reject-${listing.id}`}
                              className={`text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 ${actionLoading === `reject-${listing.id}` ? 'opacity-50' : ''}`}
                            >
                              {actionLoading === `reject-${listing.id}` ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <X className="h-3 w-3 mr-1" />}
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListingApprovalsPage;
