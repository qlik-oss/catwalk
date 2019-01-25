describe('usage', () => {
  it('should support basic usage functions', async () => {
    const app = process.env.DocID || 'drugcases.qvf';
    const url = `http://${host}:1234/?engine_url=ws://${engine}:9076/${app}`;

    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });

    // Wait until the app has loaded data from engine
    await page.waitForSelector('.model');
    await wsHelper.waitUntilNoRequests(250);

    // Skip tutorial
    await page.click('[data-test-id=button-skip]');

    // Make and verify a selection
    await page.click('[fieldz=Key_Ind_Drug]');
    await page.click('[title="\'10003554-1\' (No numerical representation)"]');
    await page.waitForSelector('.selection-field');
    await wsHelper.waitUntilNoRequests(250);
    let img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('selection', OPTS);

    // Show the extra information box
    await page.click('.SVGInline.extra-information-icon');
    await page.waitForSelector('h2');
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('extra-information-box', OPTS);

    // Make another selection in the selection bar
    await page.click('[aria-label=close]');
    await page.click('.selection-field > .field');
    await page.click('[title="\'10003554-2\' (No numerical representation)"]');
    await wsHelper.waitUntilNoRequests(250);

    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('make-another-selection-in-selection-bar', OPTS);

    // Clear selections
    await page.click('.SVGInline.clear-selection');
    await wsHelper.waitUntilNoRequests(250);
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('cleared-selections', OPTS);

    // Accept the cookies since the button is blocking opening of the hypercube
    await page.click('.cookieConsent > button');

    // Open hypercube view
    await page.click('[title="Create a new hypercube"]');
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('open-hypercube-view', OPTS);

    // Create a hypercube
    await page.click('[data-title="# Countries"]');
    await page.click('[title="Add another column"]');
    await page.waitForSelector('[data-title="# Death by primary suspect"]');
    await page.click('[data-title="# Death by primary suspect"]');
    await wsHelper.waitUntilNoRequests(250);
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('created-hypercube', OPTS);

    // Close hypercube and open menu
    await page.click('.SVGInline.close');
    await page.click('.topbarLogo', { button: 'right' });
    page.waitForSelector('.react-contextmenu-item');
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('opened-menu', OPTS);
  });
});
