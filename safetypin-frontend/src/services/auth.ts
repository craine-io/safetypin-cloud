// Auth service for SafetyPin

// Import mock Amplify for demo
import { Auth } from '../utils/mock-amplify';
import { User } from '../types/auth.types';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInResponse {
  user: User;
  token: string;
}

/**
 * Sign in a user
 */
export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
  try {
    const response = await Auth.signIn(email, password);
    
    // In a real app, we would extract the token from the response
    const token = 'mock-token';
    
    const user: User = {
      id: response.attributes.sub,
      email: response.attributes.email,
      firstName: response.attributes.given_name || '',
      lastName: response.attributes.family_name || '',
      company: response.attributes.company || '',
      phoneNumber: response.attributes.phone_number || '',
    };
    
    return { user, token };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign up a new user
 */
export const signUp = async (params: SignUpParams): Promise<void> => {
  const { email, password, firstName, lastName } = params;
  
  try {
    await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        given_name: firstName,
        family_name: lastName,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Confirm sign up with verification code
 */
export const confirmSignUp = async (email: string, code: string): Promise<void> => {
  try {
    await Auth.confirmSignUp(email, code);
  } catch (error) {
    console.error('Confirm sign up error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await Auth.currentAuthenticatedUser();
    
    return {
      id: response.attributes.sub,
      email: response.attributes.email,
      firstName: response.attributes.given_name || '',
      lastName: response.attributes.family_name || '',
      company: response.attributes.company || '',
      phoneNumber: response.attributes.phone_number || '',
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await Auth.forgotPassword(email);
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Complete password reset
 */
export const forgotPasswordSubmit = async (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Update user attributes
 */
export const updateUserAttributes = async (attributes: Partial<User>): Promise<User> => {
  try {
    // Mock implementation
    console.log('Update user attributes:', attributes);
    
    // In a real app, we'd call the actual update method
    // await Auth.updateUserAttributes(user, attributes);
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Return the updated user (mocked)
    return {
      ...currentUser,
      ...attributes,
    };
  } catch (error) {
    console.error('Update user attributes error:', error);
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    // In a real app:
    // const user = await Auth.currentAuthenticatedUser();
    // await Auth.changePassword(user, oldPassword, newPassword);
    
    // Mock implementation
    console.log('Change password:', { oldPassword, newPassword });
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

export default {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  forgotPassword,
  forgotPasswordSubmit,
  updateUserAttributes,
  changePassword,
};
