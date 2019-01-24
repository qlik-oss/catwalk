const wsHelper = require('./test-helper');

const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';

const incorrectEngineUrl = `http://${host}:1234/?engine_url=ws://incorrect-url:9076`;
const correctEngineUrl = `http://${host}:1234/?engine_url=ws://${engine}:9076/`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};
let page;

describe('doc-list', () => {
  beforeEach(async () => {
    page = await browser.newPage();
    const client = page._client;
    await client.send('Animation.setPlaybackRate', { playbackRate: 12 });

    wsHelper.init(client);
  });

  it('should show the no engine found with invalid engine url', async () => {
    await page.goto(incorrectEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('[value=Connect]');
    const img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('no-engine-doc-list', OPTS);
  });

  it('should show the doc list when a valid engine url is provided', async () => {
    // Check that the doc-list is rendered correctly.
    await page.goto(correctEngineUrl, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitForSelector('.doc-list');
    let img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('valid-engine-doc-list', OPTS);

    // Verify that clicking on an app opens it.
    // await page.click('.doc-list > li');
    await Promise.all([
      page.click('.doc-list > li'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);

    await wsHelper.waitUntilNoRequests(500);

    // This seems to be the last elements to render, the text inside the columns.
    await page.waitForSelector('.name-and-text > .bartext', { visible: true });

    img = await page.screenshot({ fullPage: true });
    await expect(img).to.matchImageOf('loaded-app', OPTS);
  });
});
