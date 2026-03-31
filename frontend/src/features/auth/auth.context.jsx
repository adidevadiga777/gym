import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true to check token

    // Check for token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Assuming there's a /me endpoint to get user info from token
                    const response = await axios.get(`${API_URL}/auth/get-me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = useCallback(async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password
            });
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            console.log("user loggedIn", response.data);
            return true;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRegister = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            return true;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        handleLogin,
        handleRegister,
        logout
    }), [user, loading, handleLogin, handleRegister, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

