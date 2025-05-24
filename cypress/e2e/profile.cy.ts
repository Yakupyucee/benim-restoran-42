/// <reference types="cypress" />

describe("Profile", () => {
  beforeEach(() => {
    // Login before each test
    cy.visit("/giris");
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="login-submit"]').click();
    cy.visit("/profil");
  });

  it("should display user information", () => {
    cy.get('[data-testid="user-name"]').should("be.visible");
    cy.get('[data-testid="user-email"]').should("be.visible");
  });

  it("should update user profile", () => {
    cy.get('[data-testid="edit-profile"]').click();
    cy.get('[data-testid="name-input"]').clear().type("Updated Name");
    cy.get('[data-testid="save-profile"]').click();
    cy.get('[data-testid="user-name"]').should("contain", "Updated Name");
  });

  it("should view order history", () => {
    cy.get('[data-testid="order-history"]').click();
    cy.get('[data-testid="order-list"]').should("be.visible");
  });

  it("should change password", () => {
    cy.get('[data-testid="change-password"]').click();
    cy.get('[data-testid="current-password"]').type("password123");
    cy.get('[data-testid="new-password"]').type("newpassword123");
    cy.get('[data-testid="confirm-password"]').type("newpassword123");
    cy.get('[data-testid="save-password"]').click();
    cy.get('[data-testid="success-message"]').should("be.visible");
  });

  it("should update delivery address", () => {
    cy.get('[data-testid="edit-address"]').click();
    cy.get('[data-testid="address-input"]').clear().type("New Address 123");
    cy.get('[data-testid="save-address"]').click();
    cy.get('[data-testid="user-address"]').should("contain", "New Address 123");
  });
});
