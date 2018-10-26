import React from 'react';
import enigma from 'enigma.js';
import SVGInline from 'react-svg-inline';

import config from '../enigma/config';
import TopBar from './topbar';
import Model from './model';
import logo from '../assets/catwalk.svg';

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
      engineURL: new URLSearchParams(document.location.search).get('engine_url') || 'ws://localhost:9076/',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appChanged = this.appChanged.bind(this);
  }

  async componentDidMount() {
    let qixGlobal;
    const session = enigma.create(config);
    try {
      qixGlobal = await session.open();
      const appHandle = await qixGlobal.getDoc(); // Mixin from ./src/enigma/get-doc
      const appLayout = await appHandle.getAppLayout();
      appHandle.on('changed', this.appChanged);
      this.setState({ session, app: appHandle, lastReloadTime: appLayout.qLastReloadTime });
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
    const { session, app } = this.state;
    if (session) {
      session.close();
    }
    app.removeListener('changed', this.appChanged);
  }

  async appChanged() {
    const { app, lastReloadTime } = this.state;
    const appLayout = await app.getAppLayout();
    const currentReloadTime = appLayout.qLastReloadTime;
    if (lastReloadTime !== currentReloadTime) {
      this.setState({ lastReloadTime: appLayout.qLastReloadTime });
    }
  }

  handleSubmit(event, docId) {
    let { engineURL } = this.state;
    if (docId) {
      engineURL = `${new URL(engineURL).origin}${docId}`;
    } else {
      event.preventDefault();
    }
    window.history.replaceState({}, '', `${window.location.pathname}?engine_url=${encodeURI(engineURL)}`);
    window.location.reload(false);
  }

  handleChange(event) {
    this.setState({ engineURL: event.target.value });
  }

  render() {
    const {
      app,
      docs,
      error,
      engineURL,
      lastReloadTime,
    } = this.state;

    // Render the doclist(global is defined == connection to engine)
    if (docs) {
      return (
        <div className="doc-list">
          <SVGInline className="logo" svg={logo} />
          <ul>
            {/* eslint-disable-next-line */}
            {docs.map(doc => <li onClick={() => this.handleSubmit(event, doc.qDocId)} key={doc.qDocId}><div className="doc-info">{doc.qTitle}<br /><span className="description">{doc.qMeta.description}</span></div></li>)}
          </ul>
        </div>
      );
    }

    // Display engine URL input (WebSocket error catched == wsURL is wrong)
    if (error) {
      if (error.target && error.target.constructor.name === 'WebSocket') {
        return (
          <div className="connect">
            <SVGInline className="logo" svg={logo} />
            <form onSubmit={this.handleSubmit}>
              <label> {/* eslint-disable-line */}
                Qlik Assosiative Engine WS URL:
                <input type="text" value={engineURL} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Reload" />
            </form>
          </div>
        );
      }

      throw error;
    }

    // Render the app
    if (app) {
      return (
        <AppContext.Provider value={app}>
          <div className="app">
            <TopBar lastReloadTime={lastReloadTime} />
            <Model lastReloadTime={lastReloadTime} />
          </div>
        </AppContext.Provider>
      );
    }

    return null;
  }
}
