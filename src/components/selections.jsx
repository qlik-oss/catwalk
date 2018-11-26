import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import useModel from './use/model';
import useLayout from './use/layout';
import SelectionField from './selection-field';

import './selections.pcss';

const definition = {
  qInfo: { qType: 'selections' },
  qSelectionObjectDef: {},
};

export default function Selections({ app }) {
  const selfRef = useRef(null);

  async function clearAllSelections() {
    try {
      await app.clearAll();
    } catch (err) {
      app.abortModal(true);
      app.clearAll();
    }
  }

  const layout = useLayout(useModel(app, definition));
  let maxWidth = 0;
  if (selfRef && selfRef.current) {
    maxWidth = selfRef.current.getBoundingClientRect().right;
  }
  let items;

  if (layout) {
    items = layout.qSelectionObject.qSelections.map(item => (
      <li key={item.qField}>
        <SelectionField app={app} field={item.qField} fieldData={item} maxWidth={maxWidth} />
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
      <li key="clear" className="clear" onClick={() => clearAllSelections()}>✖</li>
      <div className="selections-inner" ref={selfRef}>
        {items}
      </div>
    </ul>
  );
}

Selections.propTypes = {
  app: PropTypes.object.isRequired,
};
