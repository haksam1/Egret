import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Mail, RotateCw } from 'lucide-react';
import VerificationCodeInput from './VerificationCodeInput';

const VerifyEmailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationError, setVerificationError] = useState(false);

    const handleVerification = async (code: string) => {
        setError('');
        setVerificationError(false);
        setIsLoading(true);

        try {
            const response = await authService.verifyEmail(email, code);
            if (response.returnCode === 200) {
                toast.success(response.returnMessage);
                navigate('/login');
            } else {
                setError(response.returnMessage);
                setVerificationError(true);
                toast.error(response.returnMessage);
            }
        } catch (err: any) {
            setError(err.message);
            setVerificationError(true);
            toast.error(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const response = await authService.resendVerificationCode(email);
            if (response.returnCode === 200) {
                toast.success(response.returnMessage);
                setVerificationError(false);
                setError('');
            } else {
                toast.error(response.returnMessage);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to resend code');
        } finally {
            setIsResending(false);
        }
    };

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
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Verify your email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We've sent a verification code to <span className="font-medium text-green-600">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-md bg-red-50 p-4">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 text-sm text-red-700">{error}</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-6 space-y-6">
                        <VerificationCodeInput 
                            onComplete={handleVerification}
                            disabled={isLoading}
                            error={verificationError}
                            email={email}
                            onResend={handleResendCode}
                        />

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-green-600 hover:text-green-500"
                            >
                                Back to login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;