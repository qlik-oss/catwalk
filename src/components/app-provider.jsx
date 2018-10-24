import React from 'react';
import PropTypes from 'prop-types';

export const AppContext = React.createContext(null);
const AppConsumer = AppContext.Consumer;

// eslint-disable-next-line react/prefer-stateless-function
export class AppProvider extends React.Component {
  render() {
    const { app, children } = this.props;

    return (
      <AppContext.Provider value={app}>
        {children}
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  app: PropTypes.object,
  children: PropTypes.object.isRequired,
};

AppProvider.defaultProps = {
  app: {},
};

export default AppConsumer;
