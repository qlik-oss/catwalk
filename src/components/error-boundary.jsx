import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../catwalk.svg';

import './error-boundary.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      engineURL: new URLSearchParams(document.location.search).get('engine_url') || 'ws://localhost:9076/app/drugcases',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  handleChange(event) {
    this.setState({ engineURL: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { engineURL } = this.state;
    window.history.replaceState({}, '', `${window.location.pathname}?engine_url=${encodeURI(engineURL)}`);
    window.location.reload(false);
  }

  render() {
    const { error, engineURL } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <div className="error">
          <div>
            <img src={logo} className="logo" alt="Logo" />
            <h1>
              Initialization failed:&nbsp;&nbsp;
              <font color="red">
                { error.message }
              </font>
            </h1>

            <form onSubmit={this.handleSubmit}>
              <label> {/* eslint-disable-line */}
                Qlik Assosiative Engine WS URL:
                <input type="text" value={engineURL} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Reload" />
            </form>
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
