import React from 'react';
import ReactDOM from 'react-dom';
import enigma from 'enigma.js';

import config from './enigma/config';
import App from './components/app';

import './index.css';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;


function setupApp(global) {
  if (process.env.ENGINE_URL) {
    // assume we're attaching to a session:
    return global.getActiveDoc();
  }
  return global.openDoc('/data/drugcases.qvf');
}

class Index extends React.Component {
  constructor() {
    super();
    const session = enigma.create(config);
    session.open()
      .then(setupApp)
      .then(app => this.setState({ app }))
      .catch(error => this.setState({ error }));
    this.state = { session };
  }

  componentWillUnmount() {
    const { session } = this.state;
    session.close();
  }

  render() {
    const { app, error } = this.state;
    if (error) {
      return (
        <div className="error">
          <div>
            <h1>
Initialization failed
            </h1>
            {' '}
            <pre>
              <code>
                {error.stack}
              </code>
            </pre>
          </div>
        </div>
      );
    }
    if (!app) {
      return null;
    }
    return (
      <App app={app} />
    );
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root'),
);

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
