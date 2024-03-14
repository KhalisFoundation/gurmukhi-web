describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
    cy.contains('Shabadavali');
    cy.contains('Sign Up');
    cy.contains(
      'Before you start adding new words to your vocabulary, we just need some information from you.',
    );
    cy.get('.signup').click();
    cy.get('#name').type('Test User');
    cy.get('#email').type('cypresstestsingh@gmail.com');
    cy.get('#password').type('Abcd1234');
    cy.get('#cpassword').type('Abcd1234');
    cy.get('#btn-signup').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Test User');
  });
});
