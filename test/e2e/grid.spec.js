/* global page */

const url = `http://localhost:1234/?engine_url=ws://localhost:9076/${process.env.DocID}`;
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

console.log(browser.version()); //eslint-disable-line

describe('Catwalk', () => {
  it('should render the grid correctly', async () => {
    await page.goto(url, { timeout: 4000, waitUntil: 'networkidle0' });
    await page.waitFor(4000);

    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('grid', OPTS);
  });
});
