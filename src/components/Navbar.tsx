import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';
import { User, LogOut, Calendar, Settings, ChevronDown, ChevronUp, Menu, X, TablePropertiesIcon } from 'lucide-react';
import logo from '../logo/egret other-04.png';

const Navbar: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const isHomePage = location.pathname === '/';

  if (!isHomePage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Egret Hospitality Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fallback-logo.png';
                }}
              />
            </Link>

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: "/restaurants", name: "Hotels" },
              { path: "/activities", name: "Activities" },
              { path: "/contact", name: "Contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-1 py-2 text-sm font-medium ${
                  location.pathname.startsWith(item.path) 
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="ml-3 relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white flex items-center justify-center text-sm font-medium">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.firstName}
                  </span>
                  {isUserMenuOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white ring-1 ring-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Signed in as</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      My Bookings
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-gray-100"
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
        <div className="md:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {[
              { path: "/restaurants", name: "Hotels" },
              { path: "/activities", name: "Activities" },
              { path: "/contact", name: "Contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 text-base font-medium ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white flex items-center justify-center text-sm font-medium mr-3">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-green-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-green-50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-base font-medium text-green-600 bg-green-50 hover:bg-green-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
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