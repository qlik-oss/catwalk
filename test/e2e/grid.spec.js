/* global page */
// const puppeteer = require('puppeteer-core'); //eslint-disable-line

const url = `http://host.docker.internal:1234/?engine_url=ws://qix-engine:9076/${process.env.DocID}`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

describe('Catwalk', () => {
  it('should render the grid correctly', async () => {
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });
    // await page.waitFor(4000);

    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('grid', OPTS);
  });
});
