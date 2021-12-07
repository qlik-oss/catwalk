describe('doc-list', () => {
  it('should show the no engine found with invalid engine url', () => {
    const incorrectEngineUrl = 'incorrect-url';
    cy.visit(`http://localhost:1234/?engine_url=ws://${incorrectEngineUrl}:9076`);
    cy.findByText('Websocket connection failed.').should('exist');
    cy.get('#engineURL').should('have.value', `ws://${incorrectEngineUrl}:9076`);

    cy.findByText('Connect to a Qlik Core engine').should('not.be.visible');
    cy.get('.Collapsible__trigger').click();
    cy.findByText('Connect to a Qlik Core engine').should('be.visible');
  });

  it('should show the doc list when a valid engine url is provided', () => {
    const engine = 'wss://sense-demo.qlik.com/app/';
    const hostWithEngineUrl = `http://localhost:1234/?engine_url=${engine}`;
    cy.visit(hostWithEngineUrl);

    // Check that the doc list is rendered.
    cy.get('.doc-list').should('exist');

    // Verify that clicking an app, opens it.
    cy.get('.doc-list > li').first().click();
    cy.get('.model');
  });
});
