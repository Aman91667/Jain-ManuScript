// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {
    authService,
    LoginCredentials,
    SignupNormalCredentials,
    SignupResearcherCredentials,
    User,
} from '@/services/authService';

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    signup: (credentials: SignupNormalCredentials | SignupResearcherCredentials) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    userRole: 'user' | 'researcher' | 'admin' | 'unknown';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    
    // 1. Helper function to get initial state from local storage
    const getInitialUser = (): User | null => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                return JSON.parse(userData) as User;
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                localStorage.removeItem('userData');
                localStorage.removeItem('authToken');
                return null;
            }
        }
        return null;
    };

    // 🚩 FIX: Initialize state by calling getInitialUser
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Function to clear all session data (Helper for logout and validation failure)
    const clearSession = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    // 2. Set up Axios header and perform token validation check in useEffect.
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        const validateSession = async () => {
            if (token) {
                // Set the header immediately so authService can validate the token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

                try {
                    // This call validates the token and fetches fresh user data
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser); // Update with the latest server data
                    localStorage.setItem('userData', JSON.stringify(currentUser));
                } catch (err) {
                    // Token is expired, invalid, or server connection failed. Logout the user.
                    console.error("Token validation failed, logging out:", err);
                    clearSession();
                }
            } else {
                // No token found, clear session to be safe
                clearSession(); 
            }
            // Always set isLoading to false when the session check is complete
            setIsLoading(false);
        };

        validateSession();
    }, []); // Run only once on mount

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const { user: loggedInUser, token } = await authService.login(credentials);
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (credentials: SignupNormalCredentials | SignupResearcherCredentials) => {
        setIsLoading(true);
        try {
            const isResearcher = 'idProofFile' in credentials;
            const { user: newUser, token } = isResearcher
                ? await authService.signupResearcher(credentials as SignupResearcherCredentials)
                : await authService.signupNormal(credentials as SignupNormalCredentials);

            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(newUser));
            setUser(newUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout(); // Clear server session/cookie (if applicable)
        clearSession(); // Clears local storage and state
        setIsLoading(false); 
    };

    const isAuthenticated = !!user;
    // Use optional chaining for robustness
    const userRole = user?.role ?? 'unknown';

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                signup,
                isAuthenticated,
                isLoading,
                userRole: userRole as AuthContextType['userRole'],
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};