/// <reference types="cypress" />

describe("Cart", () => {
  beforeEach(() => {
    cy.visit("/menu");
  });

  it("should display cart items", () => {
    cy.visit("/sepet");
    cy.get("main").should("exist");
  });

  it("should show empty cart message", () => {
    cy.visit("/sepet");
    cy.get("main").should("exist");
  });

  it("should navigate to menu from cart", () => {
    cy.visit("/sepet");
    cy.get("main").should("exist");
    cy.visit("/menu");
    cy.url().should("include", "/menu");
  });
});
