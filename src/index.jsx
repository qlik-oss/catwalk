import React from 'react';
import ReactDOM from 'react-dom';


import ErrorBoundary from './components/error-boundary';
import App from './components/app';
import UseErrorReporting from './components/error-reporting';
import { getWebIntegrationId, getTenantUrl } from './util';
import useCsrf from './components/use/csrf';
import Loading from './components/loading';
import Splash from './components/splash';
import './index.pcss';

let app = <App />;

const Index = () => {
  const wid = getWebIntegrationId();
  if (wid) {
    const tenant = getTenantUrl();
    const [csrfToken, error] = useCsrf(tenant, wid);
    if (error) {
      return <Splash error={error} />;
    }
    if (!csrfToken) {
      return <Loading />;
    }

    app = <App csrfToken={csrfToken} />;
  }

  return (
    <ErrorBoundary>
      {app}
      <UseErrorReporting GA={process.env.GA} />
    </ErrorBoundary>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
