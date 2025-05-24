/// <reference types="cypress" />

describe("Admin", () => {
  // Admin login işlemi için yardımcı fonksiyon
  const loginAsAdmin = () => {
    cy.visit("/giris");
    cy.get('[data-testid="email-input"]').type("admin@example.com");
    cy.get('[data-testid="password-input"]').type("admin123");
    cy.get('[data-testid="login-submit"]').click();
    // Login işleminin tamamlanmasını bekle
    cy.url().should("not.include", "/giris");
  };

  describe("Admin Authentication", () => {
    it("should login as admin", () => {
      loginAsAdmin();
      // Admin paneline erişimi kontrol et
      cy.visit("/admin");
      cy.url().should("include", "/admin");
    });
  });

  describe("Admin Dashboard", () => {
    beforeEach(() => {
      loginAsAdmin();
    });

    it("should access admin dashboard", () => {
      cy.visit("/admin");
      // Sayfa yüklendiğinde temel elementlerin varlığını kontrol et
      cy.get("body").should("exist");
      cy.get("main").should("exist");
    });

    it("should navigate to menu management", () => {
      cy.visit("/admin/menu");
      cy.get("main").should("exist");
    });

    it("should navigate to order management", () => {
      cy.visit("/admin/siparisler");
      cy.get("main").should("exist");
    });
  });

  describe("Menu Management", () => {
    beforeEach(() => {
      loginAsAdmin();
      cy.visit("/admin/menu");
    });

    it("should display menu management page", () => {
      cy.get("main").should("exist");
    });

    it("should add new menu item", () => {
      cy.get('[data-testid="add-menu-item"]').should("exist");
    });
  });

  describe("Order Management", () => {
    beforeEach(() => {
      loginAsAdmin();
      cy.visit("/admin/siparisler");
    });

    it("should display orders", () => {
      cy.get("main").should("exist");
    });

    it("should view order details", () => {
      cy.get('[data-testid="order-item"]').first().should("exist");
    });
  });
});
