import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      wsURL: 'ws://localhost:9076/app/drugcases',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  handleChange(event) {
    this.setState({ wsURL: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { wsURL } = this.state;
    window.history.replaceState({}, '', `${window.location.pathname}?session=${encodeURI(wsURL)}`);
    window.location.reload(false);
  }

  render() {
    const { error, wsURL } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <div className="error">
          <div>
            <h1>
              Initialization failed:&nbsp;&nbsp;
              <font color="red">
                { error.message }
              </font>
            </h1>

            <form onSubmit={this.handleSubmit}>
              <label> {/* eslint-disable-line */}
                Qlik Assosiative Engine WS URL:
                <input type="text" value={wsURL} onChange={this.handleChange} />
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
