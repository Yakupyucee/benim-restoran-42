
import React from 'react'
import { Input } from '../../src/components/ui/input'

describe('Input Component', () => {
  it('renders with default props', () => {
    cy.mount(<Input placeholder="Enter text" />)
    cy.get('[data-testid="input"]').should('be.visible')
    cy.get('[data-testid="input"]').should('have.attr', 'placeholder', 'Enter text')
  })

  it('handles text input', () => {
    cy.mount(<Input />)
    cy.get('[data-testid="input"]').type('Hello World')
    cy.get('[data-testid="input"]').should('have.value', 'Hello World')
  })

  it('can be disabled', () => {
    cy.mount(<Input disabled />)
    cy.get('[data-testid="input"]').should('be.disabled')
    cy.get('[data-testid="input"]').should('have.class', 'disabled:opacity-50')
  })

  it('supports different input types', () => {
    cy.mount(<Input type="email" />)
    cy.get('[data-testid="input"]').should('have.attr', 'type', 'email')
  })

  it('applies custom className', () => {
    cy.mount(<Input className="custom-class" />)
    cy.get('[data-testid="input"]').should('have.class', 'custom-class')
  })
})
