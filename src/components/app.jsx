import React from 'react';
import PropTypes from 'prop-types';

import Selections from './selections';
import Model2 from './model2';

import './app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { app } = this.props;

    return (
      <div className="app">
        <Selections app={app} />
        <Model2 app={app} />
      </div>
    );
  }
}

App.propTypes = {
  app: PropTypes.object.isRequired,
};

export default App;
