import React, { useState, useEffect } from 'react';
import { Check, X, User, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';

interface UserType {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  registered?: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService().sendPostToServer('admin/users', {}) as { data?: UserType[], message?: string };
        const usersData = response?.data || (response as any)?.returnObject || [];
        if (!Array.isArray(usersData)) throw new Error(response?.message || 'Invalid users data format');
        setUsers(usersData);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const handleActivate = async (id: string) => {
    try {
      setActionLoading(`activate-${id}`);
      const response = await apiService().sendPostToServer('admin/users/activate', { id }) as { message?: string };
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
      toast.success(response?.message || 'User activated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to activate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      setActionLoading(`deactivate-${id}`);
      const response = await apiService().sendPostToServer('admin/users/deactivate', { id }) as { message?: string };
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'inactive' } : u));
      toast.success(response?.message || 'User deactivated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">View, activate/deactivate, and manage user accounts</p>
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
            placeholder="Search users by name or email..."
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
                {['Name', 'Email', 'Registered', 'Status', 'Actions'].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No users match your search' : 'No users to display'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.registered || '')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {user.status === 'inactive' && (
                          <button
                            onClick={() => handleActivate(user.id)}
                            disabled={actionLoading === `activate-${user.id}`}
                            className={`text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 ${actionLoading === `activate-${user.id}` ? 'opacity-50' : ''}`}
                          >
                            {actionLoading === `activate-${user.id}` ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                            Activate
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            disabled={actionLoading === `deactivate-${user.id}`}
                            className={`text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 ${actionLoading === `deactivate-${user.id}` ? 'opacity-50' : ''}`}
                          >
                            {actionLoading === `deactivate-${user.id}` ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <X className="h-3 w-3 mr-1" />}
                            Deactivate
                          </button>
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

export default UserManagementPage;
