import React from 'react';
import renderer from 'react-test-renderer';
import UseErrorReporting from '../../src/components/error-reporting';

jest.mock('react-ga', () => ({
  pageview: jest.fn(),
  initialize: jest.fn(),
}));

global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    pathname: 'some value',
  },
});

describe('error-reporting', () => {
  it('should display cookie if not set', () => {
    // const sandbox = sinon.createSandbox();
    // sandbox.stub(ReactGA, 'initialize');
    // sandbox.stub(ReactGA, 'pageview');
    // sandbox.stub(window, 'location').value({ pathname: 'some value' });
    // sandbox.stub(process, 'env').value({ GA: 'some value' });
    process.env.GA = 'some value';

    const tree = renderer.create(<UseErrorReporting GA={process.env.GA} />).toJSON();

    expect(tree).toMatchSnapshot();
    // sandbox.restore();
  });
});
