import React, { useState, useEffect } from 'react';
import enigma from 'enigma.js';

import config from '../enigma/config';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';

import './app.css';

export const AppContext = React.createContext(null);
export const AppConsumer = AppContext.Consumer;

export default function App() {
  const [app, setApp] = useState(null);
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  const [lastReloadTime, setLastReloadTime] = useState(null);

  async function appChanged() {
    const { qLastReloadTime } = await this.getAppLayout();
    if (lastReloadTime !== qLastReloadTime) {
      setLastReloadTime(qLastReloadTime);
    }
  }

  useEffect(async () => {
    const session = enigma.create(config);
    let qixGlobal;

    try {
      qixGlobal = await session.open();
      const openedApp = await qixGlobal.getDoc();
      setApp(openedApp);
      openedApp.on('changed', appChanged);
      appChanged.call(openedApp);
    } catch (err) {
      if (qixGlobal) {
        const docList = await qixGlobal.getDocList();
        setDocs(docList);
      } else {
        setError(err);
      }
    }

    return () => {
      if (app) {
        app.removeListener('changed', appChanged);
      }
      if (session) {
        session.close();
      }
    };
    // 'false' here means we'll only execute this side-effect once
  }, [false]);

  if (!lastReloadTime) {
    return (
      <Splash
        docs={docs}
        error={error}
        engineURL={config.url}
      />
    );
  }

  return (
    <AppContext.Provider value={app}>
      <div className="app">
        <TopBar lastReloadTime={lastReloadTime} />
        <Model lastReloadTime={lastReloadTime} />
      </div>
    </AppContext.Provider>
  );
}
