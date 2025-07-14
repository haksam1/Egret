"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle,
  MoreHorizontal,
  Loader2,
  Check,
  X,
} from "lucide-react";
import apiService from "../../services/apiService";
import { toast } from "react-hot-toast";


interface Booking {
  id: string;
  customer: string;
  business: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  amount: string;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await apiService().sendPostToServer("admin/bookings", {});
        setBookings(response?.bookings || []); // Ensure we fall back to empty array
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = (bookings || []).filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (booking.customer?.toLowerCase() || '').includes(searchLower) ||
      (booking.business?.toLowerCase() || '').includes(searchLower) ||
      (booking.service?.toLowerCase() || '').includes(searchLower);
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "confirmed" | "cancelled" | "completed"
  ) => {
    try {
      setActionLoading(`${newStatus}-${bookingId}`);
      await apiService().sendPostToServer("admin/bookingsStatus", {
        id: bookingId,
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(`Failed to ${newStatus} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiService().sendPostToServer(
        "admin/bookingsExport",
        { responseType: "blob" }
      );

      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bookings_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Bookings exported successfully");
    } catch (error) {
      console.error("Error exporting bookings:", error);
      toast.error("Failed to export bookings");
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check className="h-3 w-3 mr-1" />;
      case "cancelled":
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all system bookings
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export Bookings
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
              placeholder="Search bookings..."
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

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Customer", "Business", "Service", "Date & Time", "Amount", "Status", "Actions"].map(
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
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedStatus !== "all"
                      ? "No bookings match your search criteria" 
                      : "No bookings found"}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.business}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.date}
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <StatusButton
                              label="Confirm"
                              icon={<Check className="h-3 w-3 mr-1" />}
                              loading={actionLoading === `confirmed-${booking.id}`}
                              onClick={() =>
                                handleUpdateStatus(booking.id, "confirmed")
                              }
                              className="bg-green-100 text-green-700 hover:bg-green-200"
                            />
                            <StatusButton
                              label="Cancel"
                              icon={<X className="h-3 w-3 mr-1" />}
                              loading={actionLoading === `cancelled-${booking.id}`}
                              onClick={() =>
                                handleUpdateStatus(booking.id, "cancelled")
                              }
                              className="bg-red-100 text-red-700 hover:bg-red-200"
                            />
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <StatusButton
                            label="Complete"
                            icon={<CheckCircle className="h-3 w-3 mr-1" />}
                            loading={actionLoading === `completed-${booking.id}`}
                            onClick={() =>
                              handleUpdateStatus(booking.id, "completed")
                            }
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                          />
                        )}
                        <button className="text-xs px-3 py-1 rounded flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
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

const StatusButton = ({
  label,
  icon,
  loading,
  onClick,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  className: string;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`text-xs px-3 py-1 rounded flex items-center ${className} ${
      loading ? "opacity-50" : ""
    }`}
  >
    {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : icon}
    {label}
  </button>
);

export default AdminBookings;