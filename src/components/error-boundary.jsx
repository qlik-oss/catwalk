import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import catwalkAway from '../assets/catwalk-away.svg';
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
      return (
        <div className="center-content">
          <div>
            <SVGInline className="catwalkAway" svg={catwalkAway} />
            <h1>Initialization failed</h1>
            {' '}
            <pre>
              <code>{error.stack}</code>
            </pre>
            <pre>
              <code>{info.componentStack}</code>
            </pre>
          </div>
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
