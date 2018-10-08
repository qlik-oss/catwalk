import React from 'react';
import PropTypes from 'prop-types';
import AppConsumer from './context';

import Field from './field';
import withModel from './withModel';
import withLayout from './withLayout';
import './selections.css';

class Selections extends React.Component {
  constructor(...args) {
    super(...args);

    // this.state.definition = {
    //   qInfo: { qType: 'selections' },
    //   qSelectionObjectDef: {},
    // };
  }

  render() {
    const { app, layout } = this.props;
    if (!layout) {
      console.log('layout null');
      return null;
    }
    const items = layout.qSelectionObject.qSelections.map(item => (
      <li key={item.qField}>
        <strong title={item.qField}>{item.qField}</strong>
        <Field app={app} field={item.qField} onlyBar />
      </li>
    ));
    if (!items.length) {
      items.push(
        <li key="none" className="none">
          No selections made.
        </li>,
      );
    }
    return (
      <ul className="selections">
        <li key="clear" className="clear" onClick={() => app.clearAll()}>
          <i className="material-icons">close</i>
        </li>
        {items}
      </ul>
    );
  }
}
const definition = {
  qInfo: { qType: 'selections' },
  qSelectionObjectDef: {},
};

Selections.propTypes = {
  model: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  createModelFunc: PropTypes.func,
};

export default withModel(
  withLayout(Selections),
  async app => await app.createSessionObject({
    qInfo: { qType: 'selections' },
    qSelectionObjectDef: {},
  }),
);
