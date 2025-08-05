import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, ArrowRight, Loader2, MapPin, Plane, Car, Ticket } from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import apiService from "../../services/apiService";

type BookingType = 'hotel' | 'flight' | 'car' | 'activity';

interface BookingItem {
  id: string;
  name: string;
  type: BookingType;
  image?: string;
  location?: string;
  price: number;
  description?: string;
  
  // Hotel
  rooms?: Array<{
    id: string;
    name: string;
    price: number;
    capacity: number;
  }>;
  
  // Flight
  departure?: string;
  arrival?: string;
  airline?: string;
  
  // Car
  model?: string;
  pickupLocation?: string;
  
  // Activity
  date?: string;
  duration?: string;
}

const BookingForm: React.FC = () => {
  const { type, id } = useParams<{ type: BookingType; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Room, seat class, etc.
  const [isLoading, setIsLoading] = useState(false);
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoadingItem(true);
        const response = await apiService().sendGetToServer(`/${type}s/${id}`);
        
        if (response?.returnObject) {
          setBookingItem(response.returnObject);
          // Auto-select the first option if available (e.g., first room)
          if (response.returnObject.rooms && response.returnObject.rooms.length > 0) {
            setSelectedOption(response.returnObject.rooms[0].id);
          }
        } else {
          toast({ title: "Error", description: "Item not found", variant: "destructive" });
          navigate(`/${type}s`);
        }
      } catch (error: any) {
        toast({ title: "Error", description: error?.response?.data?.message || "Failed to load details", variant: "destructive" });
        navigate(`/${type}s`);
      } finally {
        setIsLoadingItem(false);
      }
    };

    fetchItemDetails();
  }, [type, id, navigate, toast]);

  const renderTypeSpecificFields = () => {
    if (!bookingItem) return null;

    switch (bookingItem.type) {
      case 'hotel':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="inline h-5 w-5 mr-1 text-gray-400" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={startDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="inline h-5 w-5 mr-1 text-gray-400" />
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={endDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  min={startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            {bookingItem.rooms && bookingItem.rooms.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
                <div className="space-y-2">
                  {bookingItem.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedOption(room.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedOption === room.id ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{room.name}</h4>
                        <span className="font-semibold">${room.price} per night</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Max {room.capacity} guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case 'flight':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-500">
              <Plane className="h-4 w-4 mr-2" />
              <span>{bookingItem.airline} • {bookingItem.departure} → {bookingItem.arrival}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'car':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-500">
              <Car className="h-4 w-4 mr-2" />
              <span>{bookingItem.model} • Pickup: {bookingItem.pickupLocation}</span>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={startDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input
                  type="date"
                  value={endDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  min={startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-500">
              <Ticket className="h-4 w-4 mr-2" />
              <span>{bookingItem.date} • Duration: {bookingItem.duration}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const calculateTotal = () => {
    if (!bookingItem) return 0;

    switch (bookingItem.type) {
      case 'hotel':
        if (!startDate || !endDate || !selectedOption) return 0;
        const nights = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const room = bookingItem.rooms?.find(r => r.id === selectedOption);
        return nights * (room?.price || 0);
      case 'flight':
        return bookingItem.price * guests;
      case 'car':
        if (!startDate || !endDate) return 0;
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return days * bookingItem.price;
      case 'activity':
        return bookingItem.price * guests;
      default:
        return bookingItem.price;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        type: bookingItem?.type,
        itemId: bookingItem?.id,
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0],
        guests,
        selectedOption,
        total: calculateTotal(),
      };

      const response = await apiService().sendPostToServer('/bookings', bookingData);
      toast({ title: "Booking Confirmed!", description: "Your booking was successful.", variant: "success" });
      navigate('/booking/confirmation', { state: { booking: response.returnObject } });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Booking failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (!bookingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">Booking item not found</p>
          <button
            onClick={() => navigate(`/${type}s`)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Back to {type}s
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book {bookingItem.name}</h1>
          <p className="mt-2 text-lg text-gray-600">Complete your reservation</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">{bookingItem.name}</h2>
            {bookingItem.location && (
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {bookingItem.location}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            {renderTypeSpecificFields()}

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;