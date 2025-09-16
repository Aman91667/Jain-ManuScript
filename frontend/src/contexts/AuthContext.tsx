import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, SignupResearcherCredentials, SignupNormalCredentials} from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'researcher' | 'admin';
  isApproved: boolean;
  approvedManuscripts: string[];
}

export interface SignupNormalCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  signup: (credentials: SignupResearcherCredentials | SignupNormalCredentials) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const fetchedUser = await authService.getCurrentUser();
          setUser(fetchedUser);
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      const { user: loggedInUser, token } = await authService.login(credentials);
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupResearcherCredentials | SignupNormalCredentials) => {
    setIsLoading(true);
    try {
      const isResearcherSignup = 'idProofFile' in credentials;
      const { user: newUser, token } = isResearcherSignup
        ? await authService.signupResearcher(credentials as SignupResearcherCredentials)
        : await authService.signupNormal(credentials as SignupNormalCredentials);

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};