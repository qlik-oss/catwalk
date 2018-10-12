import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

import './index.css';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;

class Index extends React.Component {
  constructor() {
    super();
    this.state = { error: null };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="error">
          <div>
            <h1>Initialization failed</h1>
            {' '}
            <pre>
              <code>{error.stack}</code>
            </pre>
          </div>
        </div>
      );
    }
    return <App />;
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
