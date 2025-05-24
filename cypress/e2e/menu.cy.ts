/// <reference types="cypress" />

describe("Menu", () => {
  beforeEach(() => {
    cy.visit("/menu");
  });

  it("should display menu items", () => {
    cy.get('[data-testid="menu-item"]').should("have.length.at.least", 1);
  });

  it("should filter menu items by category", () => {
    cy.get('[data-testid="category-filter"]').first().click();
    cy.get('[data-testid="menu-item"]').should("exist");
  });

  it("should search menu items", () => {
    cy.get('[data-testid="search-input"]').type("pizza");
    cy.get('[data-testid="menu-item"]').should("exist");
  });

  it("should view menu item details", () => {
    cy.get('[data-testid="menu-item"]').first().click();
    cy.url().should("include", "/menu/");
    cy.get('[data-testid="item-details"]').should("be.visible");
  });

  it("should add item to cart from menu", () => {
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should("not.equal", "0");
  });

  it("should sort menu items", () => {
    cy.get('[data-testid="sort-select"]').select("price-asc");
    cy.get('[data-testid="menu-item"]').should("exist");
  });
});
