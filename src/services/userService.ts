import { GenericResponse } from '../types';

const API_URL = 'http://localhost:8080';

export const userService = {
    async getCurrentUser(): Promise<GenericResponse<any>> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not logged in');

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch user');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch user');
        }
    },
};
