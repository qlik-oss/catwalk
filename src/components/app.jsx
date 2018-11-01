import React from 'react';
import enigma from 'enigma.js';

import config from '../enigma/config';
import Cube from './cube';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';

import './app.css';

export const AppContext = React.createContext(null);
export const AppConsumer = AppContext.Consumer;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: null,
      docs: null,
      error: null,
      engineURL: config.url,
    };
    this.appChanged = this.appChanged.bind(this);
  }

  async componentDidMount() {
    let qixGlobal;
    const session = enigma.create(config);
    try {
      qixGlobal = await session.open();
      const app = await qixGlobal.getDoc();
      app.on('changed', this.appChanged);
      this.setState({ session, app });
      // trigger initial fetch:
      app.emit('changed');
    } catch (error) {
      if (qixGlobal) {
        const docs = await qixGlobal.getDocList();
        this.setState({ docs });
      } else {
        this.setState({ error });
      }
    }
  }

  componentWillUnmount() {
    const { app, session } = this.state;
    if (app) {
      app.removeListener('changed', this.appChanged);
    }
    if (session) {
      session.close();
    }
  }

  async appChanged() {
    const { app, lastReloadTime } = this.state;
    const { qLastReloadTime } = await app.getAppLayout();
    if (lastReloadTime !== qLastReloadTime) {
      this.setState({ lastReloadTime: qLastReloadTime });
    }
  }

  render() {
    const {
      app,
      docs,
      error,
      engineURL,
      lastReloadTime,
    } = this.state;

    if (!app) {
      return (
        <Splash
          docs={docs}
          error={error}
          engineURL={engineURL}
        />
      );
    }

    // Render the app
    if (app) {
      return (
        <AppContext.Provider value={app}>
          <div className="app">
            <TopBar lastReloadTime={lastReloadTime} />
            <Model lastReloadTime={lastReloadTime} />
            <Cube />
          </div>
        </AppContext.Provider>
      );
    }

    return null;
  }
}
