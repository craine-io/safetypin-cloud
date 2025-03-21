// Mock implementation of AWS Amplify Auth
export const Auth = {
  currentAuthenticatedUser: () => {
    const isAuthenticated = localStorage.getItem('mockIsAuthenticated') === 'true';
    if (isAuthenticated) {
      return Promise.resolve({
        attributes: {
          sub: '12345',
          email: localStorage.getItem('mockEmail') || 'user@example.com',
          given_name: 'Demo',
          family_name: 'User',
        }
      });
    } else {
      return Promise.reject('User is not authenticated');
    }
  },
  
  signIn: (email, password) => {
    // For demo purposes, any password will work
    localStorage.setItem('mockIsAuthenticated', 'true');
    localStorage.setItem('mockEmail', email);
    return Promise.resolve({
      attributes: {
        sub: '12345',
        email: email,
        given_name: 'Demo',
        family_name: 'User',
      }
    });
  },
  
  signUp: () => Promise.resolve({}),
  confirmSignUp: () => Promise.resolve('SUCCESS'),
  signOut: () => {
    localStorage.removeItem('mockIsAuthenticated');
    localStorage.removeItem('mockEmail');
    return Promise.resolve();
  },
  forgotPassword: () => Promise.resolve({}),
  forgotPasswordSubmit: () => Promise.resolve({})
};

// Mock configure function
export const Amplify = {
  configure: (config) => {
    console.log('Mock Amplify configured');
  }
};