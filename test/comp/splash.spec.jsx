import React from 'react';
import renderer from 'react-test-renderer';
import Splash from '../../src/components/splash';

describe('Splash', () => {
  it('renders correctly', () => {
    const docs = [];
    const error = null;
    const engineURL = '';

    const tree = renderer.create(<Splash
      docs={docs}
      error={error}
      engineURL={engineURL}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
