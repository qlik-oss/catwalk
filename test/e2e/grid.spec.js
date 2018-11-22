/* global page */
// const puppeteer = require('puppeteer-core'); //eslint-disable-line

const host = process.env.CI === 'true' ? 'localhost' : 'host.docker.internal';
const engine = process.env.CI === 'true' ? 'localhost' : 'qix-engine';
const app = process.env.DocID || 'drugcases.qvf';

const url = `http://${host}:1234/?engine_url=ws://${engine}:9076/${app}`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

describe('Catwalk', () => {
  it('should render the grid correctly', async () => {
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });
    await page.waitFor(4000);

    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('grid', OPTS);
  });
});
