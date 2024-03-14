describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:8000');
    cy.url().should('include', '/login');
    cy.contains('Shabadavali');
    cy.contains('Sign In');
    cy.contains(
      'Before you start adding new words to your vocabulary, we just need some information from you.',
    );
    cy.get('#username').type('testsingh@gmail.com');
    cy.get('#spassword').type('Abcd1234');
    cy.get('#btn-signIn').click();
    cy.url().should('include', '/dashboard');
    cy.get('#drop-down-menu').click();
    cy.get('#btn-logout').click();
    cy.url().should('include', '/login');
  });
});
