import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Calendar, ChevronDown, ChevronUp, Menu, X, TablePropertiesIcon } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { authService } from '../../services/authService';
import logo from '../../logo/egret other-04.png';

const Navbar: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Hide navbar on these paths and all their subpaths
  const hiddenPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/business/register',
    '/business/dashboard',
    '/dashboard',
    '/approvals',
    '/admin',
    '/admin/',
    '/admin/dashboard',
    '/admin/approvals',
    '/admin/users',
    '/admin/businesses',
    '/admin/bookings',
    '/admin/transactions',
    '/admin/settings',
    '/admin/listing-approvals',
    '/admin/listing',
    '/business/ListOfProperty'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('button[aria-label="Open main menu"]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Hide navbar if current path starts with any of the hidden paths
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center mr-10">
              <Link to="/" className="focus:outline-none group">
                <img 
                  src={logo} 
                  alt="Egret Hospitality Logo" 
                  className="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-logo.png';
                  }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {[
                { path: "/destinations", name: "Destinations" },
                { path: "/hotels", name: "Hotels" },
                { path: "/restaurants", name: "Restaurants" },
                { path: "/activities", name: "Activities" }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith(item.path) 
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                  {location.pathname.startsWith(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></span>
                  )}
                </Link>
              ))}
              <Link
              // to="/business/CreateProperty"
               to="/business/ListOfProperty"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <TablePropertiesIcon className="h-5 w-5 mr-3 text-gray-500" />
              List Your Property
            </Link>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white flex items-center justify-center text-sm font-medium shadow-md group-hover:shadow-lg transition-all duration-300">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="text-gray-700 font-medium hidden md:inline">
                    {user.firstName}
                  </span>
                  {isUserMenuOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 hidden md:inline" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 hidden md:inline" />
                  )}
                </button>
                
                {isUserMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white ring-1 ring-gray-200 focus:outline-none z-50 overflow-hidden animate-fade-in"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Signed in as</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <User className="h-5 w-5 mr-3 text-gray-500" />
                      My Profile
                    </Link>
                    <Link
                      to="/account/bookings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="sm:hidden bg-white shadow-xl rounded-b-lg animate-slide-down"
          ref={mobileMenuRef}
        >
          <div className="pt-2 pb-3 space-y-1">
            {[
              { path: "/destinations", name: "Destinations" },
              { path: "/hotels", name: "Hotels" },
              { path: "/restaurants", name: "Restaurants" },
              { path: "/activities", name: "Activities" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 text-base font-medium ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-500'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                } transition-colors duration-200 mx-2 rounded-md`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-6 border-t border-gray-200">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white flex items-center justify-center text-sm font-medium shadow-md mr-3">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-base font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-md shadow-sm transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;