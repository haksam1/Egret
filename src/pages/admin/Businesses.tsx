import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Loader2, Search } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';

interface Business {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  created_at: string;
  last_updated_at?: string;
  status?: string;
  business_type_id?: string;
  owner_name?: string;
  owner_email?: string;
  updated_at?: string;
  business_type_name?: string;
}

const AdminBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessTypes, setBusinessTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const res = await apiService().sendPostToServer<any>('admin/businesses', {});
        let list: Business[] = [];
        if (res?.success && Array.isArray(res?.returnObject || res?.data)) {
          // Log all statuses for debugging
          console.log('Business statuses:', (res.returnObject || res.data).map((b: any) => b.status));
          list = (res.returnObject || res.data)
            // REMOVE FILTER: Show all businesses regardless of status
            .map((b: any) => ({
              id: b.id,
              name: b.name,
              contact_email: b.contact_email || b.contactEmail,
              contact_phone: b.contact_phone || b.contactPhone,
              description: b.description,
              created_at: b.created_at || b.createdAt,
              last_updated_at: b.last_updated_at || b.lastUpdatedAt,
              status: b.status,
              business_type_id: b.business_type_id?.toString() || b.businessTypeId?.toString(),
              owner_name: b.owner_name || b.ownerName,
              owner_email: b.owner_email || b.ownerEmail,
              updated_at: b.updated_at || b.updatedAt,
              business_type_name: b.business_type_name || b.businessTypeName
            }));
        }
        setBusinesses(list);
      } catch (err) {
        toast.error('Failed to load businesses');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchBusinessTypes = async () => {
      try {
        const res = await apiService().sendPostToServer<any>('admin/businessTypes', {});
        if (res?.success && Array.isArray(res?.returnObject || res?.data)) {
          const map: Record<string, string> = {};
          (res.returnObject || res.data).forEach((type: any) => {
            map[type.id?.toString()] = type.name;
          });
          setBusinessTypes(map);
        }
      } catch (err) {
        setBusinessTypes({});
      }
    };
    fetchBusinessTypes();
    fetchBusinesses();
  }, []);

  const filteredBusinesses = (businesses || []).filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(searchLower) ||
      (b.contact_email?.toLowerCase() || '').includes(searchLower) ||
      (b.contact_phone?.toLowerCase() || '').includes(searchLower) ||
      (b.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Building className="h-7 w-7 mr-2 text-green-600" /> Registered Businesses
          </h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all registered businesses</p>
        </div>
        <Link
          to="/business/register"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Add New Business
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search businesses..."
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading businesses...</p>
                  </td>
                </tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm
                      ? "No businesses match your search criteria"
                      : "No businesses found"}
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{b.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.contact_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.contact_phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.created_at ? new Date(b.created_at).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.last_updated_at ? new Date(b.last_updated_at).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {b.business_type_id ? businessTypes[b.business_type_id] || b.business_type_id : ''}
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

export default AdminBusinesses;