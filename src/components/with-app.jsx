import React from 'react';

import { AppContext } from './AppProvider';

function withApp(WrappedComponent) {
  const WithApp = props => (
    <AppContext.Consumer>
      {app => (!app ? (null) : (
        <WrappedComponent {...props} app={app} />
      ))
      }
    </AppContext.Consumer>
  );

  return WithApp;
}

export default withApp;
