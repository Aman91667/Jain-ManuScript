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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'user' | 'researcher' | 'admin' | 'unknown'>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved).role : 'unknown';
  });

  // --- Setup Axios Authorization Header & fetch current user ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const fetchUser = async () => {
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setUserRole(currentUser.role || 'unknown');
          localStorage.setItem('userData', JSON.stringify(currentUser));
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(credentials);
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setUserRole(loggedInUser.role || 'unknown');
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
      setUserRole(newUser.role || 'unknown');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserRole('unknown');
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
        isLoading,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
