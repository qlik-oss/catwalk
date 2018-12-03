import React, { useMemo, useEffect } from 'react';
import usePromise from 'react-use-promise';
import enigma from 'enigma.js';

import config from '../enigma/config';
import useLayout from './use/layout';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';
import Cubes from './cubes';
import reloadInProgressInterceptor from '../enigma/reload-in-progress-interceptor';
import './app.pcss';

export const AppContext = React.createContext(null);
export const AppConsumer = AppContext.Consumer;

const useGlobal = session => usePromise(useMemo(() => session.open(), [session]));
const useApp = global => usePromise(useMemo(() => (global ? global.getDoc() : null), [global]));
const useDocList = (global, fetchList) => usePromise(useMemo(() => (fetchList ? global.getDocList() : null), [global, fetchList]));

export default function App() {
  const session = useMemo(() => enigma.create(config), [false]);
  const [global, socketError] = useGlobal(session);
  const [app, appError] = useApp(global);
  const [docs, docsError] = useDocList(global, appError && global);
  const appLayout = useLayout(app);
  useEffect(() => () => {
    if (!app) return;
    session.close();
  }, [app]);
  const reloadInProgress = reloadInProgressInterceptor.useReloadInProgress(app);

  if (!appLayout) {
    if (reloadInProgress) {
      return (<div className="reload-splasher"><div className="reload-label">Reload in progress</div></div>);
    }
    return (
      <Splash
        docs={docs}
        error={socketError || docsError}
        engineURL={config.url}
      />
    );
  }


  let reloadSplasher = null;
  if (reloadInProgress) {
    reloadSplasher = <div className="reload-splasher"><div className="reload-label">Reload in progress</div></div>;
  }
  return (
    <AppContext.Provider value={app}>
      <div className="app">
        <TopBar app={app} appLayout={appLayout} />
        <Model app={app} appLayout={appLayout} />
        <Cubes app={app} />
      </div>
      {reloadSplasher}
    </AppContext.Provider>
  );
}
