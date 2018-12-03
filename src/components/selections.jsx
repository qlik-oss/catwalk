import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import useModel from './use/model';
import useLayout from './use/layout';
import SelectionField from './selection-field';

import close from '../assets/close-outline.svg';

import './selections.pcss';

const clearButton = { className: 'clear', svg: close };

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

  const layout = useLayout(useModel(app, definition));
  let items;

  if (layout) {
    items = layout.qSelectionObject.qSelections.map(item => (
      <li key={item.qField}>
        <SelectionField app={app} field={item.qField} fieldData={item} />
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
      <div className="clear-all">
        <SVGInline {...clearButton} onClick={() => clearAllSelections()} />
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
