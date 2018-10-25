import React from 'react';
import enigma from 'enigma.js';
import SVGInline from 'react-svg-inline';

import config from '../enigma/config';
import Selections from './selections';
import Model from './model';
import logo from '../assets/catwalk.svg';
import qlik from '../assets/Qlik-Logo_TAG.svg';

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
  }

  async componentDidMount() {
    let qixGlobal;
    const session = enigma.create(config);
    try {
      qixGlobal = await session.open();
      const appHandle = await qixGlobal.getDoc(); // Mixin from ./src/enigma/get-doc
      const appLayout = await appHandle.getAppLayout();
      appHandle.lastReloadTime = appLayout.qLastReloadTime;
      this.setState({ session, app: appHandle });
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
    const { session } = this.state;
    if (session) {
      session.close();
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
    } = this.state;

    // Render the "HUB" (global is defined == connection to engine)
    if (docs) {
      return (
        <div className="doc-list">
          <SVGInline className="logo" svg={logo} />
          <ul>
            {/* eslint-disable-next-line */}
            {docs.map(doc => <li onClick={() => this.handleSubmit(event, doc.qDocId)} key={doc.qDocId}><div className="doc-info">{doc.qTitle}<br /><span className="description">{doc.qMeta.description}</span></div></li>)}
          </ul>
          <SVGInline className="qlik-logo" svg={qlik} />
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
    return (
      <AppContext.Provider value={app}>
        <div className="app">
          <Selections />
          <Model />
        </div>
      </AppContext.Provider>
    );
  }
}
