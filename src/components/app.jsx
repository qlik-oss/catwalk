import React, { useMemo, useEffect, useRef } from 'react';
import usePromise from 'react-use-promise';
import enigma from 'enigma.js';
import { useLayout } from 'hamus.js';

import { InfoBoxProvider } from './info-box';
import config from '../enigma/config';
import TopBar from './topbar';
import Model from './model';
import Splash from './splash';
import Cubes from './cubes';
import Guide from './guide';
import Loading from './loading';
import isLocalStorage from './local-storage';
import useErrorThrow from './use/error-throw';

import { useReloadInProgress } from '../enigma/reload-in-progress-interceptor';
import './app.pcss';

const useGlobal = session => usePromise(() => session.open(), [session]);
const useApp = global => usePromise(() => (global ? global.getDoc() : null), [global]);
const useDocList = (global, fetchList) => usePromise(() => (fetchList ? global.getDocList() : null), [global, fetchList]);

export default function App() {
  const session = useMemo(() => enigma.create(config), [false]);
  const [global, socketError, socketState] = useGlobal(session);
  const [app, appError, appState] = useApp(global);
  const [docs, docsError] = useDocList(global, appError && global);
  const appLayout = useErrorThrow(useLayout(app));
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

  if (socketState === 'pending') {
    return (
      <Loading />
    );
  }

  const engineUrl = new URLSearchParams(document.location.search).get('engine_url');
  if (!engineUrl && engineUrl !== '') {
    const URLobject = new URL(window.location.href);
    window.location.assign(`${URLobject.protocol}//${window.location.host}?engine_url=${config.url}`);
  }

  if (!global || (!app && appState !== 'pending')) {
    return (
      <Splash
        docs={docs}
        error={socketError || docsError}
        engineURL={config.url}
      />
    );
  }
  const localStorageEnabled = isLocalStorage();
  let cubes;
  let guide;
  if (app) {
    cubes = <Cubes app={app} closeOnClickOutside={() => !guideRef.current.isGuideRunning()} isLocalStorage={localStorageEnabled} />;
    guide = <Guide ref={guideRef} isLocalStorage={localStorageEnabled} />;
  }
  return (
    <React.Fragment>
      <div className="app">
        {guide}
        <InfoBoxProvider>
          <TopBar app={app} appLayout={appLayout} startGuide={() => guideRef.current.startGuideFunc()} isLocalStorage={localStorageEnabled} />
          <Model app={app} appLayout={appLayout} />
          {cubes}
        </InfoBoxProvider>
      </div>
      {reloadSplasher}
    </React.Fragment>
  );
}
