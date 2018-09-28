import React from 'react';
import PropTypes from 'prop-types';

import Selections from './selections';
import Model from './model';

import './app.css';

export default function App(props) {
  const { app } = props;
  return (
    <div className="app">
      <Selections app={app} />
      <Model app={app} />
    </div>
  );
}

App.propTypes = {
  app: PropTypes.object.isRequired,
};
