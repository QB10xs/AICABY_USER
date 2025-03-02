import '@testing-library/cypress/add-commands';

// Extend Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to sign in using UI
       * @example cy.signIn('test@example.com', 'password123')
       */
      signIn(email: string, password: string): Chainable<Element>;
    }
  }
}

// Add custom commands
Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.visit('/auth/signin');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Preserve cookies between tests
beforeEach(() => {
  Cypress.Cookies.preserveOnce('sb-access-token', 'sb-refresh-token');
}); 