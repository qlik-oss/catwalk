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

async function setupApp(global) {
  if (process.env.ENGINE_URL) {
    // assume we're attaching to a session:
    return await global.getActiveDoc();
  }
  return await global.openDoc('/data/drugcases.qvf');
}

class Index extends React.Component {
  constructor() {
    super();
    this.state = { app: null, error: null };
    this.getApp();
  }

  async getApp() {
    const session = enigma.create(config);
    try {
      const global = await session.open();
      const app = await setupApp(global);
      this.setState({ session, app });
    } catch (error) {
      this.setState({ error });
    }
  }

  componentWillUnmount() {
    const { session } = this.state;
    if (session) {
      session.close();
    }
  }

  render() {
    const { app, error } = this.state;
    if (error) {
      return (
        <div className="error">
          <div>
            <h1>Initialization failed</h1>
            {' '}
            <pre>
              <code>{error.stack}</code>
            </pre>
          </div>
        </div>
      );
    }
    if (!app) {
      return null;
    }
    return <App app={app} />;
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));

// if (module.hot) {
//   // used for hot module replacement during development:
//   module.hot.accept();
// }
