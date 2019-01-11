import React from 'react';
import ReactGA from 'react-ga';
import renderer from 'react-test-renderer';

import UseErrorReporting from '../../src/components/error-reporting';

describe('error-reporting', () => {
  it('should return ´null´ if GA not set', () => {
    const tree = renderer.create(<UseErrorReporting GA={null} />).toJSON();

    expect(tree).toMatchSnapshot();
    global.window.close();
  });

  it('should display cookie if not set', () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(ReactGA, 'initialize');
    sandbox.stub(ReactGA, 'pageview');
    sandbox.stub(window, 'location').value({ pathname: 'some value' });
    sandbox.stub(process, 'env').value({ GA: 'some value' });

    // process.env.GA = 'string';

    const tree = renderer.create(<UseErrorReporting GA={process.env.GA} />).toJSON();

    expect(tree).toMatchSnapshot();
    sandbox.restore();
  });
});
