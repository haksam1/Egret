
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Mountain, Bike, Waves, Castle, Users, Calendar } from 'lucide-react';

// Mock activity data - in a real app, this would come from an API
const activitiesData = [
  {
    id: "1",
    name: 'Mountain Hiking',
    type: 'Adventure',
    rating: 4.8,
    location: 'Alpine Mountains',
    price: 120,
    duration: '6 hours',
    description: 'Embark on a guided hiking adventure through scenic mountain trails with breathtaking panoramic views. Our experienced guides will lead you through various terrains while sharing insights about local flora and fauna.',
    schedule: 'Daily at 8:00 AM',
    features: [
      { name: 'Professional Guide', icon: Mountain },
      { name: 'Equipment Included', icon: Mountain },
      { name: 'Scenic Views', icon: Mountain }
    ],
    highlights: [
      'Explore trails suitable for all experience levels',
      'Learn about local ecology and wildlife',
      'Stunning photo opportunities at scenic viewpoints',
      'Small groups for personalized experience'
    ],
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: "2",
    name: 'Bike Tours',
    type: 'Exploration',
    rating: 4.5,
    location: 'Countryside',
    price: 85,
    duration: '4 hours',
    description: 'Explore the picturesque countryside on two wheels with our guided bike tours. Ride through charming villages, alongside rolling hills, and discover hidden gems inaccessible by car.',
    schedule: 'Tuesday to Sunday at 9:00 AM and 2:00 PM',
    features: [
      { name: 'Bike Rental', icon: Bike },
      { name: 'Local Guide', icon: Mountain },
      { name: 'Refreshments', icon: Mountain }
    ],
    highlights: [
      'High-quality bikes suitable for all skill levels',
      'Scenic routes carefully selected for maximum enjoyment',
      'Stops at local points of interest',
      'Refreshment break at a charming local café'
    ],
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: "3",
    name: 'Water Sports',
    type: 'Adventure',
    rating: 4.7,
    location: 'Beachfront',
    price: 150,
    duration: '3 hours',
    description: 'Experience the thrill of various water activities in our crystal-clear waters. Choose from kayaking, snorkeling, paddleboarding, and more – all equipment and instruction provided for a safe and exciting adventure.',
    schedule: 'Daily from 10:00 AM to 4:00 PM',
    features: [
      { name: 'Multiple Activities', icon: Waves },
      { name: 'Equipment Provided', icon: Waves },
      { name: 'Certified Instructors', icon: Waves }
    ],
    highlights: [
      'Explore vibrant coral reefs while snorkeling',
      'Paddle through tranquil waters in a kayak',
      'Try stand-up paddleboarding with expert instruction',
      'All safety equipment and wetsuits provided'
    ],
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  }
];

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState(2);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch with timeout
    setLoading(true);
    setTimeout(() => {
      const foundActivity = activitiesData.find(a => a.id === id);
      
      if (foundActivity) {
        setActivity(foundActivity);
        setError(null);
      } else {
        setError("Activity not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the activity you were looking for.</p>
          <Link 
            to="/activities" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            Return to Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Activity Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{activity.name}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{activity.rating}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-700">{activity.type}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="ml-1 text-gray-500">{activity.location}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <span className="text-lg font-semibold text-green-600 mr-2">${activity.price}</span>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{activity.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-gray-200 h-64 sm:h-96 w-full">
            <img 
              src={activity.image} 
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this activity</h2>
                <p className="text-gray-600 mb-6">{activity.description}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {activity.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature.name}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{activity.schedule}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                <ul className="list-disc pl-5 space-y-2 mb-8">
                  {activity.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="text-gray-600">{highlight}</li>
                  ))}
                </ul>
              </div>

              {/* Right Column - Booking */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Book this Activity</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Participants
                      </label>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <select 
                          value={participants} 
                          onChange={(e) => setParticipants(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'person' : 'people'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per person:</span>
                        <span className="font-medium">${activity.price}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-medium">× {participants}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${activity.price * participants}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/booking/activity/${id}?date=${selectedDate}&participants=${participants}`}
                      className="mt-4 block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
