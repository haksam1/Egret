import { AuthResponse, LoginRequest, RegisterRequest, GenericResponse } from '../types';
import axios from 'axios';
 
const API_URL = 'http://localhost:8080';
 
export const authService = {
    async register(request: RegisterRequest): Promise<GenericResponse<string>> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }
 
            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    },
 
    async login(request: LoginRequest): Promise<GenericResponse<AuthResponse>> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.detail === 'Bad credentials') {
                    throw new Error('Invalid email or password');
                } else if (errorData.detail?.includes('verify your email')) {
                    throw new Error('Please verify your email first');
                } else {
                    throw new Error(errorData.detail || 'Login failed');
                }
            }
 
            const data = await response.json();
            if (data.returnCode === 200 && data.returnData) {
                localStorage.setItem('token', data.returnData.token);
            }
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    },
 
    async verifyEmail(email: string, verificationCode: string): Promise<GenericResponse<string>> {
        try {
            const response = await fetch(`${API_URL}/auth/verify-email?email=${email}&verificationCode=${verificationCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Verification failed');
            }
 
            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Verification failed');
        }
    },
 
    async resendVerificationCode(email: string): Promise<GenericResponse<string>> {
        try {
            const response = await fetch(`${API_URL}/auth/resend-verification?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to resend verification code');
            }
 
            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to resend verification code');
        }
    },
 
    logout(): void {
        localStorage.removeItem('token');
    },
 
    getCurrentToken(): string | null {
        return localStorage.getItem('token');
    },
 
    async forgotPassword(email: string): Promise<GenericResponse<string>> {
        try {
            const response = await axios.post<GenericResponse<string>>(
                `${API_URL}/auth/forgot-password`,
                { email }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.returnMessage || 'Failed to send reset email');
        }
    },
 
    async resetPassword(token: string, newPassword: string): Promise<GenericResponse<string>> {
        try {
            const response = await axios.post<GenericResponse<string>>(
                `${API_URL}/auth/reset-password`,
                { token, newPassword }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.returnMessage || 'Failed to reset password');
        }
    },
};
 