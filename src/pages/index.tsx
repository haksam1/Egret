import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Calendar, Star, MapPin, Search, Globe, CreditCard, Headphones } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';
import apiService from '../services/apiService';
import logo from '../logo/egret other-04.png';

const Index: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState('');

  // Navbar logic
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setIsUserMenuOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
        !(event.target as HTMLElement).closest('button[aria-label="Open main menu"]')) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  }, [navigate, setUser]);

  const getUserInitials = useCallback((firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }, []);

  useEffect(() => {
    const fetchHotelsAndRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await apiService().sendPostToServerWithOutToken('businesses/getproperties', {});
        if (response.status === 200 && Array.isArray(response.data)) {
          setHotels(response.data.slice(0, 8));
          setFilteredHotels(response.data.slice(0, 8));
          setRestaurants(response.data.slice(0, 8));
          setFilteredRestaurants(response.data.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setHotels([]);
        setFilteredHotels([]);
        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotelsAndRestaurants();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredHotels(hotels);
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredHotels(
        hotels.filter(h =>
          h.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredRestaurants(
        restaurants.filter(r =>
          r.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, hotels, restaurants]);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  // Property Card Component
  const PropertyCard = ({ property, type }: { property: any, type: 'hotel' | 'restaurant' }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-accent border border-transparent">
      <div className="relative h-48">
        <img 
          src={property.photos?.[0]?.url || 
               (type === 'hotel' ? 
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' : 
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')} 
          alt={property.propertyName} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 text-accent px-2 py-1 rounded-md text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 fill-current mr-1" />
          {property.rating || '4.5'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1">{property.propertyName}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{property.location?.city || 'Uganda'}</span>
        </div>
        {type === 'hotel' ? (
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-muted-foreground">From</span>
            <div className="text-right">
              <span className="font-bold text-foreground">UGX {property.price || '150,000'}</span>
              <span className="block text-xs text-muted-foreground">per night</span>
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <span className="inline-block bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
              {property.cuisine || property.businessType || 'International'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Destination Card Component
  const DestinationCard = ({ name, description, imageUrl, path }: { 
    name: string, 
    description: string, 
    imageUrl: string, 
    path: string 
  }) => (
    <Link to={path} className="group relative rounded-lg overflow-hidden h-48">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-gray-200 text-sm">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="overflow-x-hidden bg-background">
    {/* Hero Section with Search */}
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-b from-primary/10 to-secondary/10 text-foreground">
        {/* Home Page Navigation & User Actions */}
        <div className="absolute left-1/2 -translate-x-1/2 top-6 z-20 w-full max-w-5xl flex flex-row items-center justify-between gap-4 px-6">
          <div className="absolute -left-10 sm:-left-18 top-50 h-full flex items-center">
            <Link to="/" className="focus:outline-none group" aria-label="Home">
              <img 
                src={logo} 
                alt="Egret Hospitality Logo" 
                className="h-14 w-auto transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fallback-logo.png';
                }}
                loading="lazy"
              />
            </Link>
          </div>
          <div className="absolute -right-8 sm:-right-12 top-0 h-full flex flex-row items-center gap-2">
            {user?.isBusiness && (
              <>
                <Link
                  to="/business/ListOfProperty"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5"
                >
                  My Businesses
                </Link>
                <Link
                  to="/business/CreateProperty"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5"
                >
                  Add Listing
                </Link>
              </>
            )}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none group bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-3 py-1.5 rounded-md"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white flex items-center justify-center text-sm font-medium shadow-sm group-hover:shadow-md transition-all duration-300">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {user.firstName}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-background ring-1 ring-border focus:outline-none z-50 overflow-hidden animate-fade-in"
                    role="menu"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">Signed in as</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3 text-muted-foreground" />
                      My Profile
                    </Link>
                    <Link
                      to="/account/bookings"
                      className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white hover:opacity-90 transition-colors duration-200 rounded-md"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-muted-foreground" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] border-2 border-white shadow-lg hover:scale-105 hover:opacity-90 transition-all duration-200"
                  style={{ minWidth: '120px', textAlign: 'center' }}
                >
                  Sign in
                </Link>
                <Link
                  to="/business/register"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:opacity-90 shadow-sm transition-all duration-300"
                >
                  Get Started Now
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80"
            style={{ filter: 'brightness(0.6)' }}
          >
            <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80" 
              alt="Uganda landscape" 
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ filter: 'brightness(0.6)' }}
            />
          </video>
          <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
              Plan with ease. Travel with confidence.
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-emerald-200 drop-shadow">
              From rides to stays — it's all here for you.
            </p>
          </div>

          <div className="w-full max-w-5xl mt-10 px-4">
            <div className="bg-background/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-border">
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label htmlFor="destination" className="block text-xs font-medium text-foreground mb-1">Destination</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="destination"
                        placeholder="Where are you going?"
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="dates" className="block text-xs font-medium text-foreground mb-1">Dates</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="dates"
                        placeholder="Select dates"
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      className="w-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7ED321]"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Hotels Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span role="img" aria-label="hotel">🏨</span> Discover Featured Hotels in Uganda
            </h2>
            <Link to="/hotels" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all hotels <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <div className="col-span-4 text-center py-12 text-muted-foreground">Loading top hotels...</div>
                {Array(4).fill(0).map((_, i) => <SkeletonCard key={`hotel-skeleton-${i}`} />)}
              </>
            ) : filteredHotels.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <div className="text-muted-foreground mb-4 flex flex-col items-center">
                  <span className="text-3xl mb-2" role="img" aria-label="no hotels">😕</span>
                  No hotels found for your search.
                </div>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="font-medium flex items-center gap-1 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Clear search <span aria-hidden>↻</span>
                </button>
              </div>
            ) : (
              filteredHotels
                .filter(hotel => hotel.location?.country?.toLowerCase() === 'uganda' || hotel.location?.country === undefined)
                .slice(0, 4)
                .map(hotel => (
                  <PropertyCard key={hotel.id} property={hotel} type="hotel" />
                ))
            )}
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Popular destinations in Uganda</h2>
            <Link to="/destinations" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all destinations
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DestinationCard
              name="Kampala"
              description="The vibrant capital city"
              imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              path="/destinations/kampala"
            />
            
            <DestinationCard
              name="Jinja"
              description="Source of the Nile"
              imageUrl="https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              path="/destinations/jinja"
            />
            
            <DestinationCard
              name="Entebbe"
              description="Lakeside retreat"
              imageUrl="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              path="/destinations/entebbe"
            />
            
            <DestinationCard
              name="Bwindi"
              description="Gorilla trekking"
              imageUrl="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              path="/destinations/bwindi"
            />
          </div>
        </section>

        {/* Property Types Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by property type</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Hotels */}
            <Link to="/hotels" className="group text-center">
              <div className="bg-background border border-border rounded-2xl p-6 mb-2 shadow-lg transition-colors duration-200 group-hover:border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Hotels" 
                  className="w-12 h-12 mx-auto object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-primary group-hover:text-primary/80">Hotels</span>
            </Link>
            
            {/* Apartments */}
            <Link to="/apartments" className="group text-center">
              <div className="bg-background border border-border rounded-2xl p-6 mb-2 shadow-lg transition-colors duration-200 group-hover:border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Apartments" 
                  className="w-12 h-12 mx-auto object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-primary group-hover:text-primary/80">Apartments</span>
            </Link>
            
            {/* Resorts */}
            <Link to="/resorts" className="group text-center">
              <div className="bg-background border border-border rounded-2xl p-6 mb-2 shadow-lg transition-colors duration-200 group-hover:border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Resorts" 
                  className="w-12 h-12 mx-auto object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-primary group-hover:text-primary/80">Resorts</span>
            </Link>
            
            {/* Villas */}
            <Link to="/villas" className="group text-center">
              <div className="bg-background border border-border rounded-2xl p-6 mb-2 shadow-lg transition-colors duration-200 group-hover:border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Villas" 
                  className="w-12 h-12 mx-auto object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-primary group-hover:text-primary/80">Villas</span>
            </Link>
            
            {/* Lodges */}
            <Link to="/lodges" className="group text-center">
              <div className="bg-background border border-border rounded-2xl p-6 mb-2 shadow-lg transition-colors duration-200 group-hover:border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Lodges" 
                  className="w-12 h-12 mx-auto object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-primary group-hover:text-primary/80">Lodges</span>
            </Link>
          </div>
        </section>

        {/* Popular Quick Trip Plans Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Popular Quick Trip Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards for quick trip plans */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
              <h3 className="font-bold text-lg text-primary">🦁 3-Day Safari + 2-Day Lake Bunyonyi</h3>
              <p className="text-muted-foreground text-sm">Experience wildlife and relaxation in one trip. Includes safari, lake stay, and transfers.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:opacity-90">View Plan</button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
              <h3 className="font-bold text-lg text-primary">🧹 1 Week Volunteer in a Rural School</h3>
              <p className="text-muted-foreground text-sm">Make a difference and explore Uganda. Includes accommodation, meals, and activities.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:opacity-90">View Plan</button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
              <h3 className="font-bold text-lg text-primary">🌊 Weekend Nile Adventure</h3>
              <p className="text-muted-foreground text-sm">Whitewater rafting, city tour, and lakeside stay. Perfect for a quick getaway.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:opacity-90">View Plan</button>
            </div>
          </div>
        </section>

        {/* Travel Deals & Highlights Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Travel Deals & Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards for deals/highlights */}
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#7ED321] rounded-xl shadow-md p-6 flex flex-col gap-2 border border-white/30">
              <h3 className="font-bold text-lg text-white">🔥 20% Off Kampala Hotels</h3>
              <p className="text-white/90 text-sm">Book this week and save on top-rated hotels in the capital.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#0079C1] bg-white hover:bg-gray-100">Book Now</button>
            </div>
            <div className="bg-gradient-to-r from-[#0079C1] to-[#00AEEF] rounded-xl shadow-md p-6 flex flex-col gap-2 border border-white/30">
              <h3 className="font-bold text-lg text-white">✈️ Flight + Hotel Bundles</h3>
              <p className="text-white/90 text-sm">Save more when you book flights and hotels together.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#7ED321] bg-white hover:bg-gray-100">See Bundles</button>
            </div>
            <div className="bg-gradient-to-r from-[#7ED321] to-[#0079C1] rounded-xl shadow-md p-6 flex flex-col gap-2 border border-white/30">
              <h3 className="font-bold text-lg text-white">🚗 Free Airport Taxi</h3>
              <p className="text-white/90 text-sm">Get a complimentary airport transfer with select hotel bookings.</p>
              <button className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#00AEEF] bg-white hover:bg-gray-100">Claim Offer</button>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span role="img" aria-label="restaurant">🍽️</span> Explore Top-Rated Restaurants in Uganda
            </h2>
            <Link to="/restaurants" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all restaurants <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <div className="col-span-4 text-center py-12 text-muted-foreground">Loading top restaurants...</div>
                {Array(4).fill(0).map((_, i) => <SkeletonCard key={`restaurant-skeleton-${i}`} />)}
              </>
            ) : filteredRestaurants.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <div className="text-muted-foreground mb-4 flex flex-col items-center">
                  <span className="text-3xl mb-2" role="img" aria-label="no restaurants">😕</span>
                  No restaurants found for your search.
                </div>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="font-medium flex items-center gap-1 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Clear search <span aria-hidden>↻</span>
                </button>
              </div>
            ) : (
              filteredRestaurants
                .slice(0, 4)
                .map(restaurant => (
                  <PropertyCard key={restaurant.id} property={restaurant} type="restaurant" />
                ))
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-12 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] rounded-2xl p-8 border border-white/30 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why choose Egret Hospitality?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Local Expertise</h3>
              <p className="text-white/90 text-sm">
                We know Uganda best - our team is based here and we personally verify every listing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CreditCard className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Best Price Guarantee</h3>
              <p className="text-white/90 text-sm">
                Found a better price elsewhere? We'll match it and give you an additional discount.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Headphones className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">24/7 Support</h3>
              <p className="text-white/90 text-sm">
                Our local customer service team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;