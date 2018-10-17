import React from 'react';
import PropTypes from 'prop-types';
import Field from './field';
import withApp from './with-app';
import withModel from './with-model';
import withLayout from './with-layout';
import './selections.css';

export const Selections = (props) => {
  const { app, layout } = props;
  if (!layout) {
    return null;
  }
  const items = layout.qSelectionObject.qSelections.map(item => (
    <Field field={item.qField} fieldData={item} />
  ));
  if (!items.length) {
    items.push(
      <div key="none" className="none">
        No selections made.
      </div>,
    );
  }
  return (
    <div className="selections">
      <li key="clear" className="clear" onClick={() => app.clearAll()}>
        <i className="material-icons">close</i>
      </li>
      {items}
    </div>
  );
};

Selections.propTypes = {
  app: PropTypes.object,
  layout: PropTypes.object,
};

Selections.defaultProps = {
  app: null,
  layout: null,
};

export default withApp(withModel(withLayout(Selections), async app => app.createSessionObject({
  qInfo: { qType: 'selections' },
  qSelectionObjectDef: {},
})));
