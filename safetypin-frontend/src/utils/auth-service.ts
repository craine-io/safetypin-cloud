// Authentication service wrapper
import { Auth, Amplify } from './mock-amplify';

export interface AuthUser {
  attributes: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phone_number?: string;
  };
}

export interface SignUpParams {
  username: string;
  password: string;
  attributes: {
    email: string;
    [key: string]: any;
  };
}

export interface AuthConfig {
  // Configuration options for the auth service
  region?: string;
  userPoolId?: string;
  userPoolWebClientId?: string;
  [key: string]: any;
}

// Configure auth service
export const configureAuth = (config: AuthConfig): void => {
  // In a real app, this would configure Amplify Auth
  console.log('Configuring auth service with:', config);
  
  // Pass configuration to the mock Amplify
  Amplify.configure(config);
};

// Auth service wrapper class
export class AuthService {
  // Get the current authenticated user
  static async getCurrentUser(): Promise<AuthUser> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return {
        attributes: {
          id: user.attributes.sub,
          email: user.attributes.email,
          firstName: user.attributes.given_name,
          lastName: user.attributes.family_name,
          company: user.attributes.company,
          phone_number: user.attributes.phone_number,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Sign in a user
  static async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const user = await Auth.signIn(email, password);
      return {
        attributes: {
          id: user.attributes.sub,
          email: user.attributes.email,
          firstName: user.attributes.given_name,
          lastName: user.attributes.family_name,
          company: user.attributes.company,
          phone_number: user.attributes.phone_number,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Sign up a new user
  static async signUp(params: SignUpParams): Promise<any> {
    try {
      return await Auth.signUp(params);
    } catch (error) {
      throw error;
    }
  }

  // Confirm sign up with verification code
  static async confirmSignUp(email: string, code: string): Promise<any> {
    try {
      return await Auth.confirmSignUp(email, code);
    } catch (error) {
      throw error;
    }
  }

  // Sign out the current user
  static async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      throw error;
    }
  }

  // Request password reset
  static async forgotPassword(email: string): Promise<any> {
    try {
      return await Auth.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  }

  // Complete password reset
  static async forgotPasswordSubmit(email: string, code: string, newPassword: string): Promise<any> {
    try {
      return await Auth.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      throw error;
    }
  }
}