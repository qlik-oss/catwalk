describe('doc-list', () => {
  it('should show the no engine found with invalid engine url', async () => {
    const incorrectEngineUrl = `http://${host}:1234/?engine_url=ws://incorrect-url:9076`;

    await page.goto(incorrectEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('[value=Connect]');
    const img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('no-engine-doc-list', OPTS);
  });

  it('should show the doc list when a valid engine url is provided', async () => {
    const correctEngineUrl = engineUrl;

    // Check that the doc-list is rendered correctly.
    await page.goto(correctEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('.doc-list');
    let img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('valid-engine-doc-list', OPTS);

    // Verify that clicking on an app opens it.
    page.click('.doc-list > li');

    await page.waitForSelector('.model');
    await wsHelper.waitUntilNoRequests(500);

    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('loaded-app', OPTS);
  });
});
