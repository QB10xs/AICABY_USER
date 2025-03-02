describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/signin');
  });

  it('should show validation errors on sign in form', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should navigate to sign up page', () => {
    cy.contains('Sign up').click();
    cy.url().should('include', '/auth/signup');
  });

  it('should show validation errors on sign up form', () => {
    cy.visit('/auth/signup');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
    cy.contains('Passwords don\'t match').should('be.visible');
  });

  it('should handle successful sign in', () => {
    const email = 'test@example.com';
    const password = 'Test123!';

    // Intercept auth request
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'fake-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'fake-refresh-token',
        user: {
          id: '123',
          email,
        },
      },
    }).as('signIn');

    // Fill and submit form
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check if request was made and redirect happened
    cy.wait('@signIn');
    cy.url().should('include', '/dashboard');
  });

  it('should handle sign in error', () => {
    // Intercept auth request with error
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 400,
      body: {
        error: 'Invalid credentials',
        error_description: 'Invalid email or password',
      },
    }).as('signInError');

    // Fill and submit form
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Check if error is displayed
    cy.wait('@signInError');
    cy.contains('Invalid email or password').should('be.visible');
  });
}); 