import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useUser } from '../../contexts/UserContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.login(formData);
            console.log('Full login response:', response);
            let user = null;
            let token = null;
            // Support both backend response shapes
            if (response.returnData) {
                token = response.returnData.token || response.token;
                user = response.returnData.user || response.returnData.storedUser || response.user || response.storedUser;
            } else {
                token = response.token;
                user = response.user || response.storedUser;
            }
            // Defensive: if user is an object and has a role, but role is lowercase, normalize it
            if (user && user.role) {
                user.role = (typeof user.role === 'string' && user.role.toUpperCase() === 'ADMIN') ? 'ADMIN' : 'USER';
            }
            if (!user || !token) {
                toast.error('Login failed: missing user or token');
                setIsLoading(false);
                return;
            }
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            // Also clear any legacy 'auth' key
            localStorage.removeItem('auth');
            toast.success(response.returnMessage || 'Login successful');
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            toast.error('An error occurred during login. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };    return (        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" 
            style={{
                background: "url('src/backgroundsimages/waterfall.jpg') no-repeat center center fixed",
                backgroundSize: 'cover'
            }}>
            
            {/* Logo */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <Link to="/" className="focus:outline-none inline-block">
                    <img 
                        src="src/logo/egret other-04.png" 
                        alt="Egret Hospitality Logo" 
                        className="h-16 w-auto transition-transform duration-300 hover:scale-105 mx-auto"
                    />
                </Link>
            </div>
            {/* Form Container with glass effect */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-white/30">
                    
                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {/* Registration Section */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    New to our platform?
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/register"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;