import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            if (response.returnCode === 200) {
                setIsSubmitted(true);
                toast.success(response.returnMessage);
            } else {
                toast.error(response.returnMessage);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
            style={{
                background: "url('src/backgroundsimages/waterfall.jpg') no-repeat center center fixed",
                backgroundSize: 'cover'
            }}>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-white/30">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <Mail className="h-6 w-6 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Check your email
                            </h2>
                            <p className="mt-4 text-gray-600">
                                We've sent password reset instructions to <span className="font-medium text-green-600">{email}</span>
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <Link
                                to="/login"
                                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Return to login
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className="text-center text-sm text-gray-500">
                                Didn't receive the email?{' '}
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="font-medium text-green-600 hover:text-green-500"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                            Forgot password?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email and we'll send you reset instructions
                        </p>
                    </div>

                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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
                                    className="block w-full pl-10 pr-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
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
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send reset instructions
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link 
                                to="/login" 
                                className="font-medium text-green-600 hover:text-green-500 inline-flex items-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;