import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import useClickOutside from './use/click-outside';
import funnel from '../assets/funnel-outline.svg';

import './cube-column-chooser.pcss';

function findAttribute(event, attrName) {
  let el = event.target;
  while (!!el && !el.getAttribute(attrName)) {
    el = el.parentElement;
  }
  const field = el && el.getAttribute(attrName);
  return field;
}

export default function CubeColumnChooser({
  alignTo, arrowStyle, chooseColumn, selectableColumns, closeOnClickOutside,
}) {
  const [filter, setFilter] = useState('');
  const inputRef = useRef(null);
  const selfRef = useRef(null);
  useClickOutside(selfRef, closeOnClickOutside(), () => {
    if (closeOnClickOutside()) {
      chooseColumn(null);
    }
  });

  const filteredColumnsOptions = selectableColumns.filter(item => item.title.toLowerCase().indexOf(filter) >= 0);


  function updateFilter(e) {
    const { value } = e.target;
    setFilter(value.toLowerCase());
  }

  function selectRow(e) {
    const title = findAttribute(e, 'data-title');
    chooseColumn(selectableColumns.find(c => c.title === title));
  }

  const itemElement = filteredColumnsOptions.map(column => (
    <li className="expression" key={`${column.title}:${column.type}`} data-title={column.title}>
      <span className="expression-title">{column.title}</span>
      <span className="expression-type">{column.type}</span>
    </li>
  ));


  const rect = alignTo.getBoundingClientRect();
  let popupStyle;
  if (arrowStyle === 'arrowRight') {
    popupStyle = { left: rect.left + rect.width / 2 - 18 * 8, top: rect.top - 43 * 8 - 4 };
  } else {
    popupStyle = { left: rect.left + rect.width / 2, top: rect.top - 43 * 8 - 4 };
  }

  return (
    <div className={`cube-column-chooser ${arrowStyle}`} style={popupStyle} ref={selfRef}>
      <div className="input-wrapper">
        <div className="filter">
          <SVGInline className="funnel" svg={funnel} />
        </div>
        <input type="text" autoFocus ref={inputRef} onKeyUp={e => updateFilter(e)} />
      </div>
      <ul className="expression-list" onClick={e => selectRow(e)}>
        {itemElement}
      </ul>
    </div>
  );
}
CubeColumnChooser.propTypes = {
  alignTo: PropTypes.any.isRequired,
  arrowStyle: PropTypes.string,
  chooseColumn: PropTypes.func.isRequired,
  selectableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeOnClickOutside: PropTypes.func,
};

CubeColumnChooser.defaultProps = {
  arrowStyle: '',
  closeOnClickOutside: () => true,
};
