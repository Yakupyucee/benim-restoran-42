
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/giris')
  })

  it('should display login form correctly', () => {
    cy.get('[data-testid="login-container"]').should('be.visible')
    cy.get('[data-testid="login-title"]').should('contain.text', 'Giriş Yap')
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-submit-button"]').should('be.visible')
    cy.get('[data-testid="forgot-password-link"]').should('contain.text', 'Şifremi unuttum')
    cy.get('[data-testid="register-link"]').should('contain.text', 'Kayıt Ol')
  })

  it('should handle form submission with empty fields', () => {
    cy.get('[data-testid="login-submit-button"]').click()
    
    // Browser validation should prevent submission
    cy.get('[data-testid="email-input"]').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty
    })
  })

  it('should fill form and attempt login', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-submit-button"]').click()
    
    // Button should show loading state
    cy.get('[data-testid="login-submit-button"]').should('contain.text', 'Giriş yapılıyor...')
  })

  it('should navigate to forgot password page', () => {
    cy.get('[data-testid="forgot-password-link"]').click()
    cy.url().should('include', '/sifre-sifirlama')
  })
})
