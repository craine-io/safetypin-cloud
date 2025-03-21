// Authentication service mock implementation
export interface AuthUser {
  attributes: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export const AuthService = {
  getCurrentUser: (): Promise<AuthUser> => {
    const isAuthenticated = localStorage.getItem('authState') === 'true';
    if (isAuthenticated) {
      return Promise.resolve({
        attributes: {
          id: '12345',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          firstName: 'Demo',
          lastName: 'User',
        }
      });
    } else {
      return Promise.reject('User is not authenticated');
    }
  },
  
  signIn: (email: string, password: string): Promise<AuthUser> => {
    // For demo purposes, any password will work
    localStorage.setItem('authState', 'true');
    localStorage.setItem('userEmail', email);
    return Promise.resolve({
      attributes: {
        id: '12345',
        email: email,
        firstName: 'Demo',
        lastName: 'User',
      }
    });
  },
  
  signUp: (params: { username: string; password: string; attributes: any }) => Promise.resolve({}),
  confirmSignUp: (email: string, code: string) => Promise.resolve('SUCCESS'),
  signOut: () => {
    localStorage.removeItem('authState');
    localStorage.removeItem('userEmail');
    return Promise.resolve();
  },
  forgotPassword: (email: string) => Promise.resolve({}),
  forgotPasswordSubmit: (email: string, code: string, newPassword: string) => Promise.resolve({})
};

// Configuration function
export const configureAuth = (config: any) => {
  console.log('Authentication service configured');
};
