const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';
const app = process.env.DocID || 'drugcases2.qvf';

const incorrectEngineUrl = `http://${host}:1234/?engine_url=ws://incorrect-url:9076/${app}`;
const correctEngineUrl = `http://${host}:1234/?engine_url=ws://${engine}:9076/`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

describe('doc-list', () => {
  it('should show the no engine found with invalid engine url', async () => {
    const page = await browser.newPage();
    await page.goto(incorrectEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('[value=Connect]');
    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('no-engine-doc-list', OPTS);
  });

  it('should show the doc list when a valid engine url is provided', async () => {
    // Check that the doc-list is rendered correctly
    const page = await browser.newPage();
    await page._client.send('Animation.setPlaybackRate', { playbackRate: 12 });
    await page.goto(correctEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('.doc-list');
    let img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('valid-engine-doc-list', OPTS);

    // Verify that clicking on an app opens it.
    await page.click('.doc-list > li');
    await page.waitForSelector('.model');
    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('loaded-app', OPTS);
  });
});
