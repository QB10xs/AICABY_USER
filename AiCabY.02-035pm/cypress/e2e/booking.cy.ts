describe('Manual Booking Flow', () => {
  beforeEach(() => {
    // Sign in before testing booking flow
    cy.signIn('test@example.com', 'password123')
    cy.visit('/booking')
  })

  it('should allow users to enter locations and submit a booking', () => {
    // Test pickup location search
    cy.findByLabelText(/pickup location/i)
      .type('Amsterdam Central')
    cy.findByText(/amsterdam centraal/i)
      .should('be.visible')
      .click()

    // Test dropoff location search  
    cy.findByLabelText(/dropoff location/i)
      .type('Rotterdam Central')
    cy.findByText(/rotterdam centraal/i)
      .should('be.visible')
      .click()

    // Verify map markers are shown
    cy.get('[data-testid="map-marker-pickup"]')
      .should('be.visible')
    cy.get('[data-testid="map-marker-dropoff"]')
      .should('be.visible')

    // Submit booking
    cy.findByRole('button', { name: /confirm booking/i })
      .click()

    // Verify success message
    cy.findByText(/booking confirmed/i)
      .should('be.visible')
  })

  it('should show validation errors for empty locations', () => {
    cy.findByRole('button', { name: /confirm booking/i })
      .click()

    cy.findByText(/pickup location is required/i)
      .should('be.visible')
    cy.findByText(/dropoff location is required/i)
      .should('be.visible')
  })

  it('should allow users to cancel a booking', () => {
    // Enter locations first
    cy.findByLabelText(/pickup location/i)
      .type('Amsterdam Central')
    cy.findByText(/amsterdam centraal/i)
      .click()
    cy.findByLabelText(/dropoff location/i)
      .type('Rotterdam Central')
    cy.findByText(/rotterdam centraal/i)
      .click()

    // Click confirm booking
    cy.findByRole('button', { name: /confirm booking/i })
      .click()

    // Verify booking confirmation shows
    cy.findByText(/booking confirmed/i)
      .should('be.visible')

    // Cancel booking
    cy.findByRole('button', { name: /cancel booking/i })
      .click()

    // Verify cancellation
    cy.findByText(/booking cancelled/i)
      .should('be.visible')
  })
}) 