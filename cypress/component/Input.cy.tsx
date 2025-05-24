import React from "react";
import { mount } from "cypress/react18";
import Input from "../../src/components/ui/input";

describe("Input Component", () => {
  it("renders with default props", () => {
    mount(<Input placeholder="Test Input" />);
    cy.get('[data-testid="input"]').should("exist");
    cy.get('[data-testid="input"]').should(
      "have.attr",
      "placeholder",
      "Test Input"
    );
  });

  it("handles input changes", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");
    mount(<Input onChange={onChangeSpy} />);
    cy.get('[data-testid="input"]').type("test value");
    cy.get("@onChangeSpy").should("have.been.called");
  });

  it("displays error message", () => {
    mount(<Input error="This is an error" />);
    cy.get('[data-testid="error-message"]').should(
      "have.text",
      "This is an error"
    );
  });

  it("disables input when disabled prop is true", () => {
    mount(<Input disabled />);
    cy.get('[data-testid="input"]').should("be.disabled");
  });
});
