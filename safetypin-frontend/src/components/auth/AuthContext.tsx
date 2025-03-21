import React, { createContext, useState, useEffect, useContext } from 'react';
// Import the mock Auth instead of AWS Amplify
import { Auth } from '../../utils/mock-amplify';
import { User } from '../../types/auth.types';

// Mock definition for CognitoUser
interface CognitoUser {
  attributes: {
    sub: string;
    email: string;
    given_name?: string;
    family_name?: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<CognitoUser>;
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
  signIn: () => Promise.resolve({} as CognitoUser),
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
      const currentUser = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser({
        id: currentUser.attributes.sub,
        email: currentUser.attributes.email,
        firstName: currentUser.attributes.given_name || '',
        lastName: currentUser.attributes.family_name || '',
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
      const user = await Auth.signIn(email, password);
      setIsAuthenticated(true);
      setUser({
        id: user.attributes.sub,
        email: user.attributes.email,
        firstName: user.attributes.given_name || '',
        lastName: user.attributes.family_name || '',
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function signUp(email: string, password: string, attributes: any) {
    try {
      return await Auth.signUp({
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
      return await Auth.confirmSignUp(email, code);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(email: string) {
    try {
      return await Auth.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  }

  async function forgotPasswordSubmit(email: string, code: string, newPassword: string) {
    try {
      return await Auth.forgotPasswordSubmit(email, code, newPassword);
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