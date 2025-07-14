"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, Building, Mail, Phone, Download, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

interface Business {
  id: string;
  name: string;
  type?: string;
  contact?: string;
  email?: string;
  phone?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted?: string;
  created_at?: string; // Added for backend compatibility
  documents?: number;
}

const BusinessApprovals: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added search functionality

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        // Fetch pending businesses using the correct endpoint and payload
        const response = await apiService().sendPostToServer('admin/businesses', { status: 'PENDING' });
        // Accept data from .data or .returnObject
        const businessesData = (response as any)?.data || (response as any)?.returnObject || [];
        if (!Array.isArray(businessesData)) {
          console.warn('Unexpected businesses data format:', businessesData);
          setBusinesses([]);
          return;
        }
        setBusinesses(businessesData);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        toast.error(err instanceof Error ? err.message : 'Failed to load business approvals');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business => {
    const searchLower = searchTerm.toLowerCase();
    return (
      business.name.toLowerCase().includes(searchLower) ||
      business.type?.toLowerCase().includes(searchLower) ||
      business.contact?.toLowerCase().includes(searchLower) ||
      business.email?.toLowerCase().includes(searchLower) ||
      business.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(`approve-${id}`);
      await apiService().sendPostToServer(`admin/approve`, { id });
      setBusinesses(prevBusinesses => 
        prevBusinesses.map(b =>
          b.id === id ? { ...b, status: 'approved' } : b
        )
      );
      toast.success("Business approved successfully");
    } catch (err) {
      console.error('Error approving business:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to approve business');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(`reject-${id}`);
      await apiService().sendPostToServer(`admin/reject`, { id });
      setBusinesses(prevBusinesses => 
        prevBusinesses.map(b =>
          b.id === id ? { ...b, status: 'rejected' } : b
        )
      );
      toast.success("Business rejected successfully");
    } catch (err) {
      console.error('Error rejecting business:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to reject business');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await apiService().sendPostToServer('admin/businessExport', {});

      if (!response) {
        throw new Error('No export data received');
      }

      const blob = new Blob(
        [response instanceof Blob ? response : JSON.stringify(response)],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `business_approvals_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("Businesses exported successfully");
    } catch (err) {
      console.error('Error exporting businesses:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to export businesses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'approved':
        return <Check className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Business Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve new business registrations
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={loading || businesses.length === 0}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search businesses by name, type, contact, email or phone..."
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Business Approvals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Business', 'Contact', 'Submitted', 'Status', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading business approvals...</p>
                  </td>
                </tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No businesses match your search' : 'No pending business approvals found'}
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Building className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {business.name}
                          </div>
                          {business.type && (
                            <div className="text-sm text-gray-500 capitalize">
                              {business.type}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {business.phone || business.contact_phone || business.email || business.contact_email ? (
                        <>
                          {(business.phone || business.contact_phone) && (
                            <div className="text-sm text-gray-900 flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-400" />
                              {business.phone || business.contact_phone}
                            </div>
                          )}
                          {(business.email || business.contact_email) && (
                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-400" />
                              {business.email || business.contact_email}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(business.submitted || business.created_at || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(business.status)}`}>
                        {getStatusIcon(business.status)}
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {business.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(business.id)}
                              disabled={actionLoading === `approve-${business.id}`}
                              className={`text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 ${
                                actionLoading === `approve-${business.id}` ? 'opacity-50' : ''
                              }`}
                            >
                              {actionLoading === `approve-${business.id}` ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Check className="h-3 w-3 mr-1" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(business.id)}
                              disabled={actionLoading === `reject-${business.id}`}
                              className={`text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 ${
                                actionLoading === `reject-${business.id}` ? 'opacity-50' : ''
                              }`}
                            >
                              {actionLoading === `reject-${business.id}` ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          to={`/admin/businesses/${business.id}`}
                          className="text-xs px-3 py-1 rounded flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          View
                        </Link>
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
export default BusinessApprovals;