// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    userLogin,
    userRegister,
    employerLogin,
    employerRegister,
    getUserProfile,
    getEmployerProfile
} from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (token && userData) {
            setUser({ ...JSON.parse(userData), role });
        }
        setLoading(false);
    }, []);

    const login = async (email, password, isEmployer = false) => {
        try {
            const response = isEmployer
                ? await employerLogin(email, password)
                : await userLogin(email, password);

            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', isEmployer ? 'employer' : 'user');

            setUser({ ...userData, role: isEmployer ? 'employer' : 'user' });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData, isEmployer = false) => {
        try {
            const response = isEmployer
                ? await employerRegister(userData)
                : await userRegister(userData);

            const { token, user: registeredUser } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            localStorage.setItem('role', isEmployer ? 'employer' : 'user');

            setUser({ ...registeredUser, role: isEmployer ? 'employer' : 'user' });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        // Navigation will be handled by the component calling logout
    };

    const fetchUserProfile = async () => {
        try {
            const response = await getUserProfile();
            setUser(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchEmployerProfile = async () => {
        try {
            const response = await getEmployerProfile();
            setUser(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching employer profile:', error);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        fetchUserProfile,
        fetchEmployerProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};