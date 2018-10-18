import React from 'react';

import Selections from './selections';
import Model from './model';
import { AppProvider } from './app-provider';

import './app.css';

export const App = () => (
  <AppProvider>
    <div className="app">
      <Selections />
      <Model />
    </div>
  </AppProvider>
);

export default App;
