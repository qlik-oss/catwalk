/* global page */

const url = 'http://localhost:1234/?engine_url=ws://localhost:9076/data/FDA%20-%20Drug%20Cases';
const OPTS = {
  artifactsPath: 'test/e2e/__artifacts__/',
};

describe('Catwalk', () => {
  it('should render the grid correctly', async () => {
    await page.goto(url, { timeout: 4000, waitUntil: 'networkidle0' });
    await page.waitFor(4000);

    const img = await page.screenshot({ fullPage: true });
    return expect(img).to.matchImageOf('grid', OPTS);
  });
});
