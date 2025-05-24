import React from "react";
import { mount } from "cypress/react18";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../src/components/ui/card";

describe("Card Component", () => {
  it("renders with default props", () => {
    mount(<Card>Test Content</Card>);
    cy.get('[data-testid="card"]').should("exist");
    cy.get('[data-testid="card"]').should("have.text", "Test Content");
  });

  it("renders with title", () => {
    mount(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    );
    cy.get('[data-testid="card-title"]').should("have.text", "Test Title");
  });

  it("renders with description", () => {
    mount(
      <Card>
        <CardHeader>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    );
    cy.get('[data-testid="card-description"]').should(
      "have.text",
      "Test Description"
    );
  });

  it("renders with footer", () => {
    mount(
      <Card>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );
    cy.get('[data-testid="card-footer"]').should("have.text", "Test Footer");
  });

  it("renders with image", () => {
    mount(<Card image="test.jpg">Content</Card>);
    cy.get('[data-testid="card-image"]').should("have.attr", "src", "test.jpg");
  });

  it("handles click events", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    mount(<Card onClick={onClickSpy}>Clickable Card</Card>);
    cy.get('[data-testid="card"]').click();
    cy.get("@onClickSpy").should("have.been.calledOnce");
  });
});
