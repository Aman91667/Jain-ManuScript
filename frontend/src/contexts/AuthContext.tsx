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
    setUser: (user: User | null) => void; // ✅ exposed setter
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
    // --- Get initial user from localStorage
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

    const [user, setUser] = useState<User | null>(getInitialUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const clearSession = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    // --- Validate token when app loads
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        const validateSession = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                    localStorage.setItem('userData', JSON.stringify(currentUser));
                } catch (err) {
                    console.error("Token validation failed, logging out:", err);
                    clearSession();
                }
            } else {
                clearSession();
            }
            setIsLoading(false);
        };

        validateSession();
    }, []);

    // --- Login
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

    // --- Signup
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

    // --- Logout
    const logout = () => {
        authService.logout();
        clearSession();
        setIsLoading(false);
    };

    const isAuthenticated = !!user;
    const userRole = user?.role ?? 'unknown';

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser, // ✅ exposed
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
