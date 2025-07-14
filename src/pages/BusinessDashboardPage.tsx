import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { businessService } from '../services/businessService';
import { useUser } from '../contexts/UserContext';

const BusinessDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [business, setBusiness] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const businessData = await businessService.getBusinessByOwnerEmail(user?.email || '');
                setBusiness(businessData);
                
                const servicesData = await businessService.getBusinessServices(businessData.id);
                setServices(servicesData);
                
                const staffData = await businessService.getBusinessStaff(businessData.id);
                setStaff(staffData);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch business data');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.email) {
            fetchBusinessData();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Business not found</h2>
                    <p className="mt-2 text-gray-600">Please register your business first.</p>
                    <button
                        onClick={() => navigate('/business/register')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Register Business
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-2xl font-bold text-gray-900">{business.businessName}</h1>
                        <p className="mt-1 text-sm text-gray-500">{business.description}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <nav className="flex -mb-px">
                            {['overview', 'services', 'staff', 'settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${
                                        activeTab === tab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Business Overview</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{services.length}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Total Staff</h3>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{staff.length}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900 capitalize">
                                        {business.verificationStatus.toLowerCase()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Services</h2>
                                <button
                                    onClick={() => navigate('/business/services/new')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Add Service
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                                        <p className="mt-2 text-lg font-semibold text-indigo-600">
                                            ${service.price}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Duration: {service.duration} minutes
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'staff' && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Staff</h2>
                                <button
                                    onClick={() => navigate('/business/staff/new')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Add Staff
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {staff.map((member) => (
                                    <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {member.user.firstName} {member.user.lastName}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{member.role}</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Email: {member.user.email}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Business Settings</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Business Information</h3>
                                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Name
                                            </label>
                                            <input
                                                type="text"
                                                value={business.businessName}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Type
                                            </label>
                                            <input
                                                type="text"
                                                value={business.businessType}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={business.phoneNumber}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Website
                                            </label>
                                            <input
                                                type="text"
                                                value={business.website || 'N/A'}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={business.address}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            readOnly
                                        />
                                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={business.city}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value={business.country}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={business.postalCode}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboardPage; 