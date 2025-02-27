describe('AI Chat Booking Flow', () => {
  beforeEach(() => {
    // Sign in before testing chat
    cy.signIn('test@example.com', 'password123')
    cy.visit('/booking/ai')
  })

  it('should allow users to send messages and receive responses', () => {
    // Type and send a message
    cy.findByRole('textbox')
      .type('I need a ride from Amsterdam to Rotterdam')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Verify message appears in chat
    cy.findByText(/I need a ride from Amsterdam to Rotterdam/i)
      .should('be.visible')

    // Wait for AI response
    cy.findByText(/I can help you book a ride/i, { timeout: 10000 })
      .should('be.visible')
  })

  it('should complete a booking through chat interaction', () => {
    // Initial booking request
    cy.findByRole('textbox')
      .type('I need a ride from Amsterdam Central to Rotterdam Central tomorrow at 2pm')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Wait for AI response with booking details
    cy.findByText(/here are the details of your booking/i, { timeout: 10000 })
      .should('be.visible')

    // Verify booking details are shown
    cy.findByText(/amsterdam centraal/i)
      .should('be.visible')
    cy.findByText(/rotterdam centraal/i)
      .should('be.visible')
    cy.findByText(/tomorrow at 2:00 PM/i)
      .should('be.visible')

    // Confirm booking
    cy.findByRole('textbox')
      .type('Yes, please confirm the booking')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Verify booking confirmation
    cy.findByText(/your booking has been confirmed/i, { timeout: 10000 })
      .should('be.visible')
  })

  it('should handle booking cancellation through chat', () => {
    // Complete a booking first
    cy.findByRole('textbox')
      .type('I need a ride from Amsterdam to Rotterdam')
    cy.findByRole('button', { name: /send/i })
      .click()
    
    cy.findByText(/here are the details of your booking/i, { timeout: 10000 })
      .should('be.visible')
    
    cy.findByRole('textbox')
      .type('Yes, confirm the booking')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Request cancellation
    cy.findByRole('textbox')
      .type('I want to cancel my booking')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Verify cancellation confirmation
    cy.findByText(/your booking has been cancelled/i, { timeout: 10000 })
      .should('be.visible')
  })

  it('should handle errors gracefully', () => {
    // Try to book with invalid location
    cy.findByRole('textbox')
      .type('I need a ride from InvalidLocation to AnotherInvalidLocation')
    cy.findByRole('button', { name: /send/i })
      .click()

    // Verify error message
    cy.findByText(/i couldn't find one or both of the locations/i, { timeout: 10000 })
      .should('be.visible')
  })
}) 