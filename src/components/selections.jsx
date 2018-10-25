import React from 'react';
import PropTypes from 'prop-types';
import Field from './field';
import withApp from './with-app';
import withModel from './with-model';
import withLayout from './with-layout';
import './selections.scss';

export const Selections = (props) => {
  const { app, layout } = props;
  if (!layout) {
    return null;
  }
  const items = layout.qSelectionObject.qSelections.map(item => (
    <li key={item.qField}>
      <Field field={item.qField} fieldData={item} />
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
};

Selections.propTypes = {
  app: PropTypes.object,
  layout: PropTypes.object,
};

Selections.defaultProps = {
  app: null,
  layout: null,
};

export default withApp(withModel({
  WrappedComponent: withLayout(Selections),
  createModel: async app => app.createSessionObject({
    qInfo: { qType: 'selections' },
    qSelectionObjectDef: {},
  }),
}));
