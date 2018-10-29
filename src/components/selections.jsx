import React, { useContext } from 'react';

import useModel from './use/model';
import useLayout from './use/layout';
import { AppContext } from './app';
import Field from './field';

import './selections.scss';

const definition = {
  qInfo: { qType: 'selections' },
  qSelectionObjectDef: {},
};

export default function Selections() {
  const app = useContext(AppContext);
  const layout = useLayout(useModel(app, definition));
  let items;

  if (layout) {
    items = layout.qSelectionObject.qSelections.map(item => (
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
