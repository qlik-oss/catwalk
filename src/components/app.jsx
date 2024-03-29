import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
import useResolvedValue from './use/resolved-value';
import { useReloadInProgress } from '../enigma/reload-in-progress-interceptor';
import './app.pcss';
import { assignEngineUrl } from '../util';

// TODO: add tests of login flow

const useGlobal = (session) => usePromise(() => session.open(), [session]);
const useApp = (global) => usePromise(() => (global ? global.getDoc() : null), [global]);

export default function App({ csrfToken }) {
  const session = useMemo(() => enigma.create(config), [false]);
  const [global, socketError, socketState] = useGlobal(session);
  const [app, appError, appState] = useApp(global);
  const appLayout = useResolvedValue(useLayout(app));
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
  // We need to update the csrf-token if the one present in the url has expired/is falsy.
  if (csrfToken) {
    const paramIndex = document.location.search.indexOf('engine_url');
    const engineUrlWParams = document.location.search.slice(paramIndex + 11, document.location.search.length);
    const newUrl = new URL(engineUrlWParams);
    const csrfTokenParam = new URLSearchParams(newUrl.search).get('qlik-csrf-token');
    if (!csrfTokenParam || csrfTokenParam !== csrfToken) {
      newUrl.searchParams.delete('qlik-csrf-token');
      newUrl.searchParams.append('qlik-csrf-token', csrfToken);

      assignEngineUrl(newUrl.href);
    }
  }

  if (!global || (!app && appState !== 'pending')) {
    const fetchDocList = !!((csrfToken || global));
    return (
      <Splash
        error={socketError || appError}
        global={global}
        engineURL={config.url}
        fetchDocList={fetchDocList}
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
    <>
      <div style={{ padding: '5px 10px', fontSize: '1.5rem' }}>
        <span style={{ color: 'red' }}>&#9888;</span>
        {' '}
        This project is no longer maintained. If you are interested in working on the project you can still create a fork of it on Github. This web-app will be shut down in February 2023.
        <hr />
      </div>
      <div className="app">
        {guide}
        <InfoBoxProvider>
          <TopBar app={app} appLayout={appLayout} startGuide={() => guideRef.current.startGuideFunc()} isLocalStorage={localStorageEnabled} />
          <Model app={app} appLayout={appLayout} isLocalStorage={localStorageEnabled} />
          {cubes}
        </InfoBoxProvider>
      </div>
      {reloadSplasher}
    </>
  );
}

App.defaultProps = {
  csrfToken: null,
};

App.propTypes = {
  csrfToken: PropTypes.string,
};
