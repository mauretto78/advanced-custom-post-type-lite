import React from 'react'
import MetaOption from './MetaOption'

describe('<MetaOption />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MetaOption />)
  })
})