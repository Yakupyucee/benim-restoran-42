
import React from 'react'
import { Button } from '../../src/components/ui/button'

describe('Button Component', () => {
  it('renders with default props', () => {
    cy.mount(<Button>Click me</Button>)
    cy.get('[data-testid="button"]').should('contain.text', 'Click me')
    cy.get('[data-testid="button"]').should('have.class', 'bg-primary')
  })

  it('renders with different variants', () => {
    cy.mount(<Button variant="outline">Outline Button</Button>)
    cy.get('[data-testid="button"]').should('have.class', 'border')
    cy.get('[data-testid="button"]').should('have.class', 'bg-background')
  })

  it('handles click events', () => {
    const onClick = cy.stub()
    cy.mount(<Button onClick={onClick}>Click me</Button>)
    cy.get('[data-testid="button"]').click()
    cy.then(() => {
      expect(onClick).to.have.been.called
    })
  })

  it('can be disabled', () => {
    cy.mount(<Button disabled>Disabled Button</Button>)
    cy.get('[data-testid="button"]').should('be.disabled')
    cy.get('[data-testid="button"]').should('have.class', 'disabled:opacity-50')
  })
})
