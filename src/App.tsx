import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { UserProvider } from './contexts/UserContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from "./components/layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import PrivateRoute from './components/PrivateRoute';

// Authentication Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Customer Pages
import Home from "./pages/index.tsx"; 
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/account/AccountPage";
import ProfilePage from "./pages/account/ProfilePage";
import SettingsPage from "./pages/account/SettingsPage";
import BookingsPage from "./pages/account/BookingsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import DestinationsPage from "./pages/DestinationsPage";
import HotelsPage from "./pages/HotelsPage";
import BookingConfirmation from "./pages/booking/BookingConfirmation";
import BookingForm from "./pages/booking/BookingForm";
import ContactPage from "./pages/ContactPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RestaurantListing from "./pages/restaurants/RestaurantListing";
import RestaurantDetailPage from "./pages/restaurants/RestaurantDetailPage";
import ActivityDetailPage from "./pages/activities/ActivityDetailPage";
import WildlifeTours from "./pages/tours/WildlifeTours";

// Business Pages
import BusinessRegistrationForm from './pages/business/BusinessRegistrationForm';
import BusinessDashboard from './pages/business/BusinessDashboard';
import HotelManagement from './pages/business/HotelManagement';
import RestaurantManagement from './pages/business/RestaurantManagement';
import TourManagement from './pages/business/TourManagement';
import ListOfProperty from "./pages/business/Listyourproperty/ListOfProperty";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BusinessApprovals from './pages/admin/BusinessApprovals';
import AdminUsers from './pages/admin/Users';
import AdminBusinesses from './pages/admin/Businesses';
import AdminBookings from './pages/admin/Bookings';
import AdminTransactions from './pages/admin/Transactions';
import AdminSettings from './pages/admin/Settings';
import ListingDetailPage from "./pages/admin/ListingDetailPage.tsx";
import ListingApprovals from "./pages/admin/ListingApprovals.tsx";
import UnauthorizedPage from './pages/UnauthorizedPage';
import BusinessDetailPage from './pages/admin/business-detail/BusinessDetailPage';

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // Save last visited path on every route change
  React.useEffect(() => {
    localStorage.setItem('lastPath', location.pathname);
  }, [location.pathname]);

  // On mount, redirect to lastPath if present and not already there
  React.useEffect(() => {
    const lastPath = localStorage.getItem('lastPath');
    if (lastPath && lastPath !== location.pathname && location.pathname === '/') {
      navigate(lastPath, { replace: true });
    }
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <BusinessProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Layout>
                <main className="flex-grow">
                  <ErrorBoundary>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/destinations" element={<DestinationsPage />} />
                      <Route path="/hotels" element={<HotelsPage />} />
                      
                      {/* Authentication Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/verify-email" element={<VerifyEmailPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      
                      {/* Customer Routes (USER only) */}
                      <Route element={<PrivateRoute allowedRoles={['USER']} />}> 
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/account/profile" element={<ProfilePage />} />
                        <Route path="/account/settings" element={<SettingsPage />} />
                        <Route path="/account/bookings" element={<BookingsPage />} />
                      </Route>
                      {/* Business Routes (USER only) */}
                      <Route element={<PrivateRoute allowedRoles={['USER']} />}> 
                        <Route path="/business/register" element={<BusinessRegistrationForm />} />
                        <Route path="/business/dashboard" element={<BusinessDashboard />} />
                        <Route path="/business/hotel" element={<HotelManagement />} />
                        <Route path="/business/restaurant" element={<RestaurantManagement />} />
                        <Route path="/business/tour" element={<TourManagement />} />
                        <Route path="/business/ListOfProperty" element={<ListOfProperty />} />
                      </Route>
                      {/* Admin Routes (ADMIN only) */}
                      <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}> 
                        <Route path="/admin" element={<AdminDashboard />}> 
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<div>Dashboard Content</div>} />
                          <Route path="approvals" element={<BusinessApprovals />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="businesses" element={<AdminBusinesses />} />
                          <Route path="businesses/:id" element={<BusinessDetailPage />} />
                          <Route path="bookings" element={<AdminBookings />} />
                          <Route path="transactions" element={<AdminTransactions />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="listing-approvals" element={<ListingApprovals />} />
                          <Route path="listing/:id" element={<ListingDetailPage />} />
                        </Route>
                      </Route>
                      
                      {/* Other public routes */}
                      <Route path="/hotels/:id" element={<HotelDetailPage />} />
                      <Route path="/booking/:type/:id" element={<BookingForm />} />
                      <Route path="/booking/confirmation" element={<BookingConfirmation />} />
                      <Route path="/wildlife" element={<WildlifeTours />} />
                      <Route path="/restaurants" element={<RestaurantListing />} />
                      <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                      <Route path="/activities" element={<ActivitiesPage />} />
                      <Route path="/activities/:id" element={<ActivityDetailPage />} />
                      
                      {/* Unauthorized Route */}
                      <Route path="/unauthorized" element={<UnauthorizedPage />} />
                      
                      {/* Catch All */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
              </Layout>
            </div>
          </TooltipProvider>
        </BusinessProvider>
      </UserProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <UserProvider>
            <BusinessProvider>
              <TooltipProvider>
                <Router>
                  <AppRoutes />
                </Router>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BusinessProvider>
          </UserProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;