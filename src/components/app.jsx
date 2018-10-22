import React from 'react';
import enigma from 'enigma.js';

import config from '../enigma/config';
import Selections from './selections';
import Model from './model';
import { AppProvider } from './app-provider';
import logo from '../catwalk.svg';

import './app.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: null,
      error: null,
      engineURL: new URLSearchParams(document.location.search).get('engine_url') || 'ws://localhost:9076/app/drugcases',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const session = enigma.create(config);
    try {
      const global = await session.open();
      const appHandle = await global.getDoc(); // Mixin from ./src/enigma/get-doc
      this.setState({ session, app: appHandle });
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

  handleChange(event) {
    this.setState({ engineURL: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { engineURL } = this.state;
    window.history.replaceState({}, '', `${window.location.pathname}?engine_url=${encodeURI(engineURL)}`);
    window.location.reload(false);
  }

  render() {
    const { app, error, engineURL } = this.state;

    if (error) {
      // throw error;

      return (
        <div>
          <img src={logo} className="logo" alt="Logo" />
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

    return (
      <AppProvider app={app}>
        <div className="app">
          <Selections />
          <Model />
        </div>
      </AppProvider>
    );
  }
}

export default App;
