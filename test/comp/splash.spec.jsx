import React from 'react';
import renderer from 'react-test-renderer';

describe('<Splash />', () => {
  const appList = <ul>list</ul>;
  const errorInfo = <span>Some error</span>;

  const [{ default: Splash }] = aw.mock(
    [
      ['**/src/components/app-list.jsx', () => () => appList],
      ['**/src/components/error-info.jsx', () => () => errorInfo],
    ],
    ['../../src/components/splash'],
  );

  it('should render <AppList />', () => {
    const error = null;
    const engineURL = '';
    const fetchDockList = true;

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
      fetchDocList={fetchDockList}
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should render <ErrorInfo /> when having error', () => {
    const error = new Error('An error occurred');
    const engineURL = '';

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  it('should render <AppList /> even though error is provided', () => {
    const error = new Error('An error occurred');
    const engineURL = '';
    const fetchDockList = true;

    const instance = renderer.create(<Splash
      error={error}
      engineURL={engineURL}
      fetchDocList={fetchDockList}
    />).toJSON();

    expect(instance).toMatchSnapshot();
  });

  // it('should display message if empty docList array', () => {
  //   const docs = [];
  //   const error = null;
  //   const engineURL = '';

  //   const tree = renderer.create(<Splash
  //     docs={docs}
  //     error={error}
  //     engineURL={engineURL}
  //   />).toJSON();

  //   expect(tree).toMatchSnapshot();
  // });
});
