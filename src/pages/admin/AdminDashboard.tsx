import React, { useState, useEffect, } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart2, Users, Building, CreditCard, Settings, Home, FileText, Shield,
  LogOut, Loader2,
} from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

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

interface StatItem {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: 'positive' | 'negative';
}

interface ActionItem {
  id: number;
  type: string;
  count: number;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavLinkItem {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AdminDashboard: React.FC = () => {
  const [pendingBusinessCount, setPendingBusinessCount] = useState(0);
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [user, setUser] = useState<{ username?: string }>({});
  const [businessTypes, setBusinessTypes] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname.endsWith('admin/dashboard') || location.pathname.endsWith('admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    fetchBusinessTypes();
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  // Fetch business types from backend
  const fetchBusinessTypes = async () => {
    try {
      const res = await apiService().sendPostToServer<any>('admin/businessTypes', {});
      // Expecting: [{ id: 1, name: 'Hotel' }, ...]
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

  const fetchDashboardData = async () => {
    setLoading(true);
    let statsSet = false;
    let pendingSet = false;
    try {
      // Dashboard stats
      let dashboardRes;
      try {
        dashboardRes = await apiService().sendPostToServer<any>('admin/dashboard', {});
        const dashboardData = dashboardRes?.returnObject || dashboardRes?.data || {};
        const mappedData = {
          totalbookings: Number(dashboardData.totalBookings || 0),
          bookingschange: 0,
          totalusers: Number(dashboardData.totalUsers || 0),
          userschange: 0,
          totalbusinesses: Number(dashboardData.totalBusinesses || 0),
          businesseschange: 0,
          totalrevenue: Number(dashboardData.totalRevenue || 0),
          revenuechange: 0
        };
        const formattedStats: StatItem[] = [
          {
            name: 'Total Bookings',
            value: mappedData.totalbookings.toLocaleString(),
            icon: BarChart2,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Registered Users',
            value: mappedData.totalusers.toLocaleString(),
            icon: Users,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Business Partners',
            value: mappedData.totalbusinesses.toLocaleString(),
            icon: Building,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Total Revenue',
            value: `$${mappedData.totalrevenue.toLocaleString()}`,
            icon: CreditCard,
            change: '0%',
            changeType: 'positive'
          }
        ];
        setStats(formattedStats);
        statsSet = true;
      } catch (err) {
        setStats([
          { name: 'Total Bookings', value: '0', icon: BarChart2, change: '0%', changeType: 'positive' },
          { name: 'Registered Users', value: '0', icon: Users, change: '0%', changeType: 'positive' },
          { name: 'Business Partners', value: '0', icon: Building, change: '0%', changeType: 'positive' },
          { name: 'Total Revenue', value: '$0', icon: CreditCard, change: '0%', changeType: 'positive' }
        ]);
      }

      // Pending count
      let pendingRes;
      try {
        pendingRes = await apiService().sendPostToServer<any>('admin/pending', {});
        let pendingCount = 0;
        if (typeof pendingRes?.returnObject === 'number') {
          pendingCount = pendingRes.returnObject;
        } else if (typeof pendingRes?.data === 'number') {
          pendingCount = pendingRes.data;
        }
        setPendingBusinessCount(Number(pendingCount));
        pendingSet = true;
      } catch (err) {
        setPendingBusinessCount(0);
      }

      // Recent businesses (optional)
      try {
        const recentRes = await apiService().sendPostToServer<any>('admin/businesses', {});
        let recentBusinessesList: Business[] = [];
        if (recentRes?.success && Array.isArray(recentRes?.returnObject || recentRes?.data)) {
          recentBusinessesList = (recentRes.returnObject || recentRes.data)
            .map((b: any) => ({
              id: b.id,
              name: b.name,
              contact_email: b.contact_email || b.contactEmail,
              contact_phone: b.contact_phone || b.contactPhone,
              description: b.description,
              status: b.status,
              created_at: b.created_at || b.createdAt,
              last_updated_at: b.last_updated_at || b.lastUpdatedAt,
              business_type_id: b.business_type_id?.toString() || b.businessTypeId?.toString(),
              owner_name: b.owner_name || b.ownerName,
              owner_email: b.owner_email || b.ownerEmail,
              updated_at: b.updated_at || b.updatedAt,
              business_type_name: b.business_type_name || b.businessTypeName
            }));
        }
        setRecentBusinesses(recentBusinessesList);
      } catch (err) {
        setRecentBusinesses([]);
      }

      if (!statsSet && !pendingSet) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    document.cookie = 'authToken=; Max-Age=0; path=/;';
    toast.success("Logged out successfully");
    setTimeout(() => navigate('/login'), 1000);
  };

  // Add navLinks, pendingActions, quickActions arrays so the dashboard renders correctly
  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', link: '/admin/dashboard', icon: Home },
    { name: 'Users', link: '/admin/users', icon: Users },
    { name: 'Bookings', link: '/admin/bookings', icon: FileText },
    { name: 'Transactions', link: '/admin/transactions', icon: CreditCard },
    { name: 'Approvals', link: '/admin/approvals', icon: Shield },
    { name: 'Settings', link: '/admin/settings', icon: Settings },
  ];
  // Show both Business Approvals and Listing Approvals in Pending Actions
  const pendingActions: ActionItem[] = [
    {
      id: 1,
      type: 'Business Approvals',
      count: pendingBusinessCount,
      link: '/admin/approvals',
      icon: Shield
    },
    {
      id: 2,
      type: 'Listing Approvals',
      count: 0, // TODO: Replace with actual pending listings count if available
      link: '/admin/listing-approvals',
      icon: FileText
    }
  ];
  const quickActions: QuickAction[] = [
    { name: 'Manage Users', link: '/admin/users', icon: Users },
    { name: 'Business Approvals', link: '/admin/approvals', icon: Shield },
    { name: 'Transactions', link: '/admin/transactions', icon: CreditCard },
    { name: 'System Settings', link: '/admin/settings', icon: Settings },
  ];

  // DEBUG: Log data to help diagnose why nothing is showing
  useEffect(() => {
    console.log('recentBusinesses:', recentBusinesses);
    console.log('stats:', stats);
    console.log('pendingBusinessCount:', pendingBusinessCount);
    console.log('businessTypes:', businessTypes);
    console.log('loading:', loading);
  }, [recentBusinesses, stats, pendingBusinessCount, businessTypes, loading]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar Navigation */}
      <div className="hidden md:flex md:w-64 bg-white shadow-md fixed h-full flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3 font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Scrollable Content Area */}
        <main className="pt-6 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
          {!isDashboardPage ? null : loading ? (
            <div className="text-center py-20 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
              <p className="mt-4">Loading dashboard data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome, {user?.username ? user.username.split(' ').slice(-1)[0] : 'Admin'} 👋
                  </h1>
                  <p className="text-sm text-gray-500">Dashboard Overview</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.name} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${
                        stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`mt-4 text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Actions */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pendingActions.map((action) => (
                    <Link
                      key={action.id}
                      to={action.link}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{action.type}</h3>
                          <p className="text-sm text-gray-500">{action.count} pending</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Businesses */}
              <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Business Registrations</h2>
                  <Link
                    to="/admin/businesses"
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    View all
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Business Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Created At</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(recentBusinesses) && recentBusinesses.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                            No recent business registrations
                          </td>
                        </tr>
                      ) : (
                        Array.isArray(recentBusinesses) && recentBusinesses.map((business) => (
                          <tr key={business.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{business.business_type_id ? businessTypes[business.business_type_id] || business.business_type_id : ''}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{business.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{business.contact_email}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{business.contact_phone}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{business.description}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{business.status}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{business.created_at ? formatDate(business.created_at) : ''}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{business.last_updated_at ? formatDate(business.last_updated_at) : ''}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                              <Link to={`/admin/businesses/${business.id}`} className="underline hover:text-blue-800">View</Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      to={action.link}
                      className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <div className="p-3 rounded-lg bg-teal-100 text-teal-600 mb-2">
                        <action.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;