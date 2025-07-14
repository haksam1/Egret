import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.resetPassword(token!, formData.newPassword);
            if (response.returnCode === 200) {
                toast.success(response.returnMessage);
                navigate('/login');
            } else {
                toast.error(response.returnMessage);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!token) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
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

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-white/30">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter your new password below
                        </p>
                    </div>

                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        minLength={8}
                                        className="block w-full pl-10 pr-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="New Password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        minLength={8}
                                        className="block w-full pl-10 pr-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

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
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium text-green-600 hover:text-green-500 inline-flex items-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;