import React from 'react';
import PropTypes from 'prop-types';

import Splash from './splash';

import './error-boundary.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      info: null,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    const { children } = this.props;
    if (error) {
      return (<Splash error={error} componentStack={info.componentStack} />);
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
