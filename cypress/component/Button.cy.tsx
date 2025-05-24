import React from "react";
import { mount } from "cypress/react18";
import Button from "../../src/components/Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    mount(<Button>Test Button</Button>);
    cy.get("button").should("exist");
    cy.get("button").should("have.text", "Test Button");
  });

  it("handles click events", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    mount(<Button onClick={onClickSpy}>Click Me</Button>);
    cy.get("button").click();
    cy.get("@onClickSpy").should("have.been.calledOnce");
  });

  it("applies variant styles", () => {
    mount(<Button variant="primary">Primary Button</Button>);
    cy.get("button").should("have.class", "primary");
  });

  it("disables button when disabled prop is true", () => {
    mount(<Button disabled>Disabled Button</Button>);
    cy.get("button").should("be.disabled");
  });
});
