/// <reference types="cypress" />

describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to login page", () => {
    cy.get('[data-testid="login-button"]').click();
    cy.url().should("include", "/giris");
  });

  it("should login with valid credentials", () => {
    cy.visit("/giris");
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should("not.include", "/giris");
  });

  it("should show error with invalid credentials", () => {
    cy.visit("/giris");
    cy.get('[data-testid="email-input"]').type("wrong@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpass");
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="error-message"]').should("be.visible");
  });

  it("should navigate to register page", () => {
    cy.get('[data-testid="register-button"]').click();
    cy.url().should("include", "/kayit");
  });

  it("should register with valid information", () => {
    cy.visit("/kayit");
    cy.get('[data-testid="name-input"]').type("Test User");
    cy.get('[data-testid="email-input"]').type("newuser@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="confirm-password-input"]').type("password123");
    cy.get('[data-testid="register-submit"]').click();
    cy.url().should("not.include", "/kayit");
  });

  it("should show error with invalid registration data", () => {
    cy.visit("/kayit");
    cy.get('[data-testid="name-input"]').type("Test User");
    cy.get('[data-testid="email-input"]').type("invalid-email");
    cy.get('[data-testid="password-input"]').type("pass");
    cy.get('[data-testid="confirm-password-input"]').type("pass123");
    cy.get('[data-testid="register-submit"]').click();
    cy.get('[data-testid="error-message"]').should("be.visible");
  });
});
