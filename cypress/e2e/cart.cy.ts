
describe('Cart Page', () => {
  beforeEach(() => {
    cy.visit('/sepet')
  })

  it('should display empty cart correctly', () => {
    cy.get('[data-testid="cart-container"]').should('be.visible')
    cy.get('[data-testid="cart-title"]').should('contain.text', 'Sepetim')
    cy.get('[data-testid="empty-cart"]').should('be.visible')
    cy.get('[data-testid="go-to-menu-button"]').should('contain.text', 'Menüye Git')
  })

  it('should navigate to menu from empty cart', () => {
    cy.get('[data-testid="go-to-menu-button"]').click()
    cy.url().should('include', '/menu')
  })
})

describe('Cart with Items', () => {
  beforeEach(() => {
    // Visit menu page first to add items to cart
    cy.visit('/menu')
    
    // Wait for menu to load and add an item to cart
    cy.get('[data-testid="button"]').contains('Sepete Ekle').first().click()
    
    // Then visit cart page
    cy.visit('/sepet')
  })

  it('should display cart items and summary', () => {
    cy.get('[data-testid="cart-items"]').should('be.visible')
    cy.get('[data-testid="order-summary"]').should('be.visible')
    cy.get('[data-testid="subtotal"]').should('be.visible')
    cy.get('[data-testid="delivery-fee"]').should('contain.text', '10.00 ₺')
    cy.get('[data-testid="total-price"]').should('be.visible')
    cy.get('[data-testid="complete-order-button"]').should('contain.text', 'Siparişi Tamamla')
    cy.get('[data-testid="clear-cart-button"]').should('contain.text', 'Sepeti Temizle')
  })
})
