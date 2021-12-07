describe('usage', () => {
  it('should support basic usage functions', () => {
    const url = 'http://localhost:1234/?engine_url=wss://sense-demo.qlik.com/app/069279ac-a7e8-4405-826d-0cd3de7d48e0';
    cy.visit(url);
    cy.get('.model').should('exist');

    // Skip tutorial
    cy.get('[data-action=skip]').click();

    // Make and verify a selection
    cy.get('[fieldz=Measurement]').click();
    cy.findByTitle("'Temperature (max)' (No numerical representation)").click();
    cy.get('.selection-field').should('exist');

    // Show the extra information box
    cy.get('.SVGInline.extra-information-icon').eq(2).click();
    cy.get('h2').should('exist');
    cy.findByText('Field Measurement in table Weather Data').should('exist');

    // Make another selection in the selection bar
    cy.findByLabelText('close').click();
    cy.findAllByText('2 of 3').should('not.exist');
    cy.get('.selection-field > .field').click();
    cy.findAllByTitle("'Temperature (min)' (No numerical representation)").eq(1).click();
    cy.findAllByText('2 of 3').should('exist');

    // Clear selections
    cy.get('.SVGInline.clear-selection').click();
    cy.findAllByText('2 of 3').should('not.exist');
    cy.get('.selection-field').should('not.exist');

    // Accept the cookies since the button is blocking opening of the hypercube
    cy.get('#rcc-confirm-button').click();

    // Open hypercube view
    cy.get('.cube-column-chooser').should('not.exist');
    cy.findByTitle('Create a new hypercube').click();
    cy.get('.cube-column-chooser').should('exist');

    // Create a hypercube
    cy.get('[data-title="measures"]').click();
    cy.get('[data-title="Average Low Temp (C)"]').click();
    cy.findByTitle('Add another column').click();
    cy.get('[data-title="measures"]').click();
    cy.get('[data-title="Cost"]').click();
    cy.findByRole('table').should('exist');
    cy.get('.ReactVirtualized__Table').should('have.attr', 'aria-colcount', '2');

    // Close hypercube and open menu
    cy.get('.SVGInline.close').click();
    cy.findByText('Data Policy').should('not.exist');
    cy.get('.menu-provider').click();
    cy.findByText('Choose App').should('exist');
    cy.findByText('Start Guide').should('exist');
    cy.findByText('Go to GitHub').should('exist');
    cy.findByText('Data Policy').should('exist');
  });
});
