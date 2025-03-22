// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/');
  cy.get('body').should('contain', 'Dashboard');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});
