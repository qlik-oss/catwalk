import React from 'react';
import PropTypes from 'prop-types';
import { useLayout, useModel } from 'hamus.js';
import SelectionField from './selection-field';
import useResolvedValue from './use/resolved-value';

import SVGclose from '../assets/close-outline.svg';

import './selections.pcss';

const clearButton = { className: 'clear' };

const definition = {
  qInfo: { qType: 'selections' },
  qSelectionObjectDef: {},
};

export default function Selections({ app }) {
  async function clearAllSelections() {
    try {
      await app.clearAll();
    } catch (err) {
      app.abortModal(true);
      app.clearAll();
    }
  }

  const model = useResolvedValue(useModel(app, definition));
  const layout = useResolvedValue(useLayout(model));
  let items;
  let clearAll;

  if (layout) {
    items = layout.qSelectionObject.qSelections.map((item) => (
      <li key={item.qField}>
        <SelectionField app={app} field={item.qField} fieldData={item} />
      </li>
    ));
    if (items.length) {
      clearAll = <SVGclose className={clearButton.className} onClick={() => clearAllSelections()} title="Clear all selections" />;
    }
  }

  return (
    <ul className="selections">
      <div className="clear-all">
        {clearAll}
      </div>
      <div className="selections-inner">
        {items}
      </div>
    </ul>
  );
}

Selections.propTypes = {
  app: PropTypes.object.isRequired,
};
