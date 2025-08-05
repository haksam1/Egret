import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  User, 
  CreditCard, 
  MapPin, 
  Mail, 
  Hotel, 
  Plane, 
  Car, 
  Ticket,
  ArrowLeft,
  Clock,
  Smartphone
} from 'lucide-react';

interface Booking {
  id: string;
  type: 'hotel' | 'flight' | 'car' | 'activity';
  item: {
    name: string;
    location?: string;
    price: number;
    image?: string;
    // Hotel specific
    checkIn?: string;
    checkOut?: string;
    room?: string;
    // Flight specific
    departure?: string;
    arrival?: string;
    airline?: string;
    // Car specific
    model?: string;
    pickupLocation?: string;
    // Activity specific
    date?: string;
    duration?: string;
  };
  guests: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod?: string;
  dates?: {
    checkIn: string;
    checkOut: string;
    nights?: number;
  };
}

const BookingConfirmation: React.FC<{}> = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast] = react-hot-toast();
  const booking: Booking = location.state?.booking || {
    id: 'RES-123456',
    type: 'hotel',
    item: {
      name: 'Luxury Beach Resort',
      location: 'Maldives',
      price: 385,
      checkIn: '2023-06-15',
      checkOut: '2023-06-18',
      room: 'Deluxe Ocean View'
    },
    guests: 2,
    total: 1155,
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    paymentMethod: 'credit_card',
    dates: {
      checkIn: '2023-06-15',
      checkOut: '2023-06-18',
      nights: 3
    }
  };

  const getTypeIcon = () => {
    switch (booking.type) {
      case 'hotel': return <Hotel className="h-5 w-5 mr-2 text-gray-500" />;
      case 'flight': return <Plane className="h-5 w-5 mr-2 text-gray-500" />;
      case 'car': return <Car className="h-5 w-5 mr-2 text-gray-500" />;
      case 'activity': return <Ticket className="h-5 w-5 mr-2 text-gray-500" />;
      default: return <Hotel className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (booking.type) {
      case 'hotel': return 'Hotel';
      case 'flight': return 'Flight';
      case 'car': return 'Car Rental';
      case 'activity': return 'Activity';
      default: return 'Booking';
    }
  };

  const getBookingDescription = () => {
    switch (booking.type) {
      case 'hotel':
        return `Your reservation at ${booking.item.name} is confirmed`;
      case 'flight':
        return `Your flight with ${booking.item.airline} is confirmed`;
      case 'car':
        return `Your ${booking.item.model} rental is confirmed`;
      case 'activity':
        return `Your ${booking.item.name} activity is confirmed`;
      default:
        return 'Your booking is confirmed';
    }
  };

  const getDateDetails = () => {
    if (booking.type === 'flight') {
      return `${new Date(booking.item.departure || '').toLocaleString()} - ${new Date(booking.item.arrival || '').toLocaleString()}`;
    }
    
    if (booking.dates) {
      return `${new Date(booking.dates.checkIn).toLocaleDateString()} - ${new Date(booking.dates.checkOut).toLocaleDateString()}${
        booking.dates.nights ? ` (${booking.dates.nights} ${booking.dates.nights > 1 ? 'nights' : 'night'})` : ''
      }`;
    }
    
    if (booking.item.date) {
      return new Date(booking.item.date).toLocaleString();
    }
    
    return 'N/A';
  };

  const getGuestDetails = () => {
    switch (booking.type) {
      case 'hotel':
        return `${booking.item.room ? `${booking.item.room} • ` : ''}${booking.guests} guest${booking.guests > 1 ? 's' : ''}`;
      case 'flight':
        return `${booking.guests} passenger${booking.guests > 1 ? 's' : ''}`;
      case 'car':
        return '1 vehicle';
      case 'activity':
        return `${booking.guests} participant${booking.guests > 1 ? 's' : ''}`;
      default:
        return `${booking.guests} guest${booking.guests > 1 ? 's' : ''}`;
    }
  };

  const getWhatsNextItems = () => {
    const baseItems = [
      'You\'ll receive a confirmation email with all the details',
      'Review cancellation policy in your confirmation email'
    ];

    switch (booking.type) {
      case 'hotel':
        return [
          ...baseItems,
          'Check-in is at 3:00 PM on your arrival date',
          'Contact the hotel directly for any special requests',
          'Bring a valid ID and the credit card used for booking'
        ];
      case 'flight':
        return [
          ...baseItems,
          'Online check-in opens 24 hours before departure',
          'Arrive at least 2 hours before your flight',
          'Have your passport/ID ready for security checks'
        ];
      case 'car':
        return [
          ...baseItems,
          'Bring your driver\'s license and credit card',
          'Inspect the vehicle before driving off',
          'Return with the same amount of fuel'
        ];
      case 'activity':
        return [
          ...baseItems,
          'Please arrive 15 minutes before the activity starts',
          'Bring appropriate gear and clothing',
          'Contact the operator for any special requirements'
        ];
      default:
        return baseItems;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  React.useEffect(() => {
    toast({ title: "Booking Confirmed!", description: "Your booking is complete.", variant: "success" });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            {getBookingDescription()}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Booking reference: {booking.id}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              {getTypeIcon()}
              {getTypeLabel()} Details
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">{booking.item.name}</h3>
            {booking.item.location && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                {booking.item.location}
              </div>
            )}
            {booking.type === 'flight' && booking.item.airline && (
              <div className="mt-1 text-sm text-gray-500">
                Operated by {booking.item.airline}
              </div>
            )}
            {booking.type === 'car' && booking.item.model && (
              <div className="mt-1 text-sm text-gray-500">
                {booking.item.model}
              </div>
            )}
            {booking.type === 'activity' && booking.item.duration && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                Duration: {booking.item.duration}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Booking Details
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  {booking.type === 'flight' ? 'Flight Times' : 'Dates'}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getDateDetails()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  {booking.type === 'flight' ? 'Passengers' : 
                   booking.type === 'car' ? 'Vehicle' : 
                   booking.type === 'activity' ? 'Participants' : 'Guests'}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getGuestDetails()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                  Total Price
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatCurrency(booking.total)}
                  {booking.paymentMethod && (
                    <span className="ml-2 text-gray-500">({booking.paymentMethod.replace('_', ' ')})</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  Confirmation Sent To
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.customer.email}
                </dd>
              </div>
              {booking.customer.phone && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-gray-400" />
                    Contact Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {booking.customer.phone}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              What's Next?
            </h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {getWhatsNextItems().map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Home
          </Link>
          <Link
            to="/account/bookings"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;