import React, { useMemo, useEffect, useRef } from 'react';
import usePromise from 'react-use-promise';
import enigma from 'enigma.js';

import config from '../enigma/config';
import useLayout from './use/layout';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';
import Cubes from './cubes';
import Guide from './guide';

import { useReloadInProgress } from '../enigma/reload-in-progress-interceptor';
import './app.pcss';

export const AppContext = React.createContext(null);
export const AppConsumer = AppContext.Consumer;

const useGlobal = session => usePromise(() => session.open(), [session]);
const useApp = global => usePromise(() => (global ? global.getDoc() : null), [global]);
const useDocList = (global, fetchList) => usePromise(() => (fetchList ? global.getDocList() : null), [global, fetchList]);

export default function App() {
  const session = useMemo(() => enigma.create(config), [false]);
  const [global, socketError] = useGlobal(session);
  const [app, appError, appState] = useApp(global);
  const [docs, docsError] = useDocList(global, appError && global);
  const appLayout = useLayout(app);
  const guideRef = useRef();

  useEffect(() => () => {
    if (!app) return;
    session.close();
  }, [app]);
  const reloadInProgress = useReloadInProgress(app);

  let reloadSplasher = null;
  if (reloadInProgress) {
    reloadSplasher = <div className="reload-splasher"><div className="reload-label">Reload in progress</div></div>;
  }

  if (!appLayout && reloadInProgress) {
    return reloadSplasher;
  }
  if (!app && appState !== 'pending') {
    return (
      <Splash
        docs={docs}
        error={socketError || docsError}
        engineURL={config.url}
      />
    );
  }
  let cubes;
  let guide;
  if (app) {
    cubes = <Cubes app={app} closeOnClickOutside={() => !guideRef.current.isGuideRunning()} />;
    guide = <Guide ref={guideRef} />;
  }
  return (
    <AppContext.Provider value={app}>
      <div className="app">
        {guide}
        <TopBar app={app} appLayout={appLayout} startGuide={() => guideRef.current.startGuideFunc()} />
        <Model app={app} appLayout={appLayout} />
        {cubes}
      </div>
      {reloadSplasher}
    </AppContext.Provider>
  );
}
