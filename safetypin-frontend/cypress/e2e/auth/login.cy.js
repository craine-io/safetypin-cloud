describe('Login Page', () => {
  beforeEach(() => {
    cy.fixture('user').then(function(testdata) {
      this.testdata = testdata;
    });
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('h1').should('contain', 'Log In');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.contains('Sign Up').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/forgot-password');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message to appear
    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'Invalid email or password');
  });

  it('should login successfully with valid credentials', function() {
    cy.get('input[name="email"]').type(this.testdata.validUser.email);
    cy.get('input[name="password"]').type(this.testdata.validUser.password);
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/');
    cy.get('body').should('contain', 'Dashboard');
  });
});
