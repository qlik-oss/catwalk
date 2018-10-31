import React, { useMemo, useEffect } from 'react';
import usePromise from 'react-use-promise';
import enigma from 'enigma.js';

import config from '../enigma/config';
import useLayout from './use/layout';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';

import './app.css';
import Measurebox from './measurebox';

export const AppContext = React.createContext(null);
export const AppConsumer = AppContext.Consumer;

const useGlobal = session => usePromise(useMemo(() => session.open(), [session]));
const useApp = global => usePromise(useMemo(() => (global ? global.getDoc() : null), [global]));
const useDocList = (global, fetchList) => usePromise(useMemo(() => (fetchList ? global.getDocList() : null), [global, fetchList]));

export default function App() {
  const session = useMemo(() => enigma.create(config), [false]);
  const [global, socketError] = useGlobal(session);
  const [app, appError] = useApp(global);
  const [docs, docsError] = useDocList(appError && global);
  const appLayout = useLayout(app);

  const showMeasures = useMemo(() => new URLSearchParams(document.location.search).get('measures'), []);
  useEffect(() => () => {
    if (!app) return;
    session.close();
  }, [app]);

  if (!appLayout) {
    return (
      <Splash
        docs={docs}
        error={socketError || docsError}
        engineURL={config.url}
      />
    );
  }

  return (
    <AppContext.Provider value={app}>
      <div className="app">
        <TopBar app={app} appLayout={appLayout} />
        <Model app={app} appLayout={appLayout} />
        {showMeasures ? (<Measurebox app={app} />) : null}
      </div>
    </AppContext.Provider>
  );
}
