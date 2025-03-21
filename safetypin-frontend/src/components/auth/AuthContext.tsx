import React, { createContext, useState, useEffect, useContext } from 'react';
// Import the auth service instead of AWS/mock-amplify
import { AuthService, AuthUser } from '../../utils/auth-service';
import { User } from '../../types/auth.types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, attributes: any) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  forgotPasswordSubmit: (email: string, code: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: () => Promise.resolve({} as AuthUser),
  signUp: () => Promise.resolve({}),
  confirmSignUp: () => Promise.resolve({}),
  signOut: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve({}),
  forgotPasswordSubmit: () => Promise.resolve({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setIsAuthenticated(true);
      setUser({
        id: currentUser.attributes.id,
        email: currentUser.attributes.email,
        firstName: currentUser.attributes.firstName || '',
        lastName: currentUser.attributes.lastName || '',
      });
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const user = await AuthService.signIn(email, password);
      setIsAuthenticated(true);
      setUser({
        id: user.attributes.id,
        email: user.attributes.email,
        firstName: user.attributes.firstName || '',
        lastName: user.attributes.lastName || '',
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function signUp(email: string, password: string, attributes: any) {
    try {
      return await AuthService.signUp({
        username: email,
        password,
        attributes: {
          email,
          ...attributes,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(email: string, code: string) {
    try {
      return await AuthService.confirmSignUp(email, code);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await AuthService.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(email: string) {
    try {
      return await AuthService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  }

  async function forgotPasswordSubmit(email: string, code: string, newPassword: string) {
    try {
      return await AuthService.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
        forgotPassword,
        forgotPasswordSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);