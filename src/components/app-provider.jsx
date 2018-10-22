import React from 'react';
import PropTypes from 'prop-types';

export const AppContext = React.createContext(null);
const AppConsumer = AppContext.Consumer;

// eslint-disable-next-line react/prefer-stateless-function
export class AppProvider extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    children: PropTypes.object.isRequired,
  };

  static defaultProps = {
    app: {},
  };

  render() {
    const { app, children } = this.props;

    return (
      <AppContext.Provider value={app}>
        {children}
      </AppContext.Provider>
    );
  }
}

export default AppConsumer;
