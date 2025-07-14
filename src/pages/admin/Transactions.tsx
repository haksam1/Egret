"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, Search, ChevronDown, Download, MoreHorizontal, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";


interface Transaction {
  id: string;
  bookingId: string;
  customer: string;
  business: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await apiService().sendPostToServer('admin/transactions', {});
        
        // More robust data validation
        if (!response) {
          throw new Error('No response from server');
        }

        const transactionsData = response.transactions ?? [];
        
        if (!Array.isArray(transactionsData)) {
          console.warn('Unexpected transactions data format:', transactionsData);
          throw new Error('Invalid transactions data format');
        }

        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      if (!transaction) return false;
      
      const searchFields = [
        transaction.customer?.toLowerCase() || '',
        transaction.business?.toLowerCase() || '',
        transaction.bookingId?.toLowerCase() || '',
        transaction.paymentMethod?.toLowerCase() || ''
      ];

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchFields.some(field => field.includes(searchTermLower));
      const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await apiService().sendPostToServer('admin/transactions/export', {});

      if (!response) {
        throw new Error('No data received for export');
      }

      // More robust blob creation
      const blob = new Blob(
        [response instanceof Blob ? response : JSON.stringify(response)],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error(`Failed to export transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExportLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all system transactions
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportLoading || transactions.length === 0}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Transactions
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions by customer, business, booking ID or payment method..."
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Booking ID', 'Customer', 'Business', 'Amount', 'Date', 'Status', 'Payment Method', 'Actions'].map(
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
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedStatus !== 'all'
                      ? 'No transactions match your search criteria'
                      : 'No transactions found'}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.bookingId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.business}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {transaction.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-xs px-3 py-1 rounded flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
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

export default AdminTransactions;