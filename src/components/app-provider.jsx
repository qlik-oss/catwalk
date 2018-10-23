import React from 'react';
import PropTypes from 'prop-types';

import enigma from 'enigma.js';
import config from '../enigma/config';

export const AppContext = React.createContext(null);
const AppConsumer = AppContext.Consumer;

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app: null,
      error: null,
    };
  }

  async componentDidMount() {
    const session = enigma.create(config);
    try {
      const global = await session.open();
      const appHandle = await global.getDoc(); // Mixin from ./src/enigma/get-doc
      const appProperties = await appHandle.getAppProperties();
      appHandle.lastReloadTime = appProperties.qLastReloadTime;
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

  render() {
    const { children } = this.props;
    const { app, error } = this.state;
    if (error) {
      throw error;
    }
    return app && (
      <AppContext.Provider value={app}>
        {children}
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AppConsumer;
