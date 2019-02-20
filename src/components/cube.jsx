import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useColumnOptions from './use/column-options';
import CubeColumnChooser from './cube-column-chooser';
import HypercubeTable from './hypercube-table';
import useForce from './use/force';

import './cube.pcss';

export default function Cube({ app, tableData: { initialColumns }, closeOnClickOutside }) {
  const selectableColumns = useColumnOptions(app);
  const [columns, setColumns] = useState(initialColumns);
  const currentHeader = useRef(null);
  const columnToReplace = useRef(null);
  const addOpen = useRef(false);
  const forceUpdate = useForce();

  function closeAdd() {
    if (currentHeader.current) {
      currentHeader.current.classList.remove('active');
    }
    addOpen.current = false;
    columnToReplace.current = null;
    forceUpdate();
  }

  function openAdd() {
    currentHeader.current.classList.add('active');
    addOpen.current = true;
    forceUpdate();
  }

  function toggleAdd(e) {
    if (!addOpen.current) {
      currentHeader.current = e.currentTarget;
      openAdd();
    } else {
      closeAdd();
    }
  }

  function addColumn(column) {
    if (column) {
      if (columnToReplace.current) {
        setColumns(columns.map(existingColumn => (existingColumn === columnToReplace.current ? column : existingColumn)));
        columnToReplace.current = null;
      } else {
        setColumns([...columns, column]);
      }
    }
    closeAdd();
  }

  function onHeaderClick({ columnData, event }) {
    columnToReplace.current = columnData;
    toggleAdd(event);
  }

  const popup = addOpen.current ? <CubeColumnChooser alignTo={currentHeader.current} selectableColumns={selectableColumns} chooseColumn={addColumn} closeOnClickOutside={closeOnClickOutside} /> : null;

  const measures = columns.filter(column => column.type === 'measure');
  const dimensions = columns.filter(column => column.type === 'dimension' || column.type === 'field');

  const isEmpty = measures.length + dimensions.length === 0;
  if (isEmpty && addOpen.current) {
    return popup;
  }
  return (
    <div className={`cube ${isEmpty ? 'empty' : ''}`}>
      {popup}
      <div className="table-wrapper">
        <div role="button" title="Add another column" tabIndex="-1" className={`column-add-button ${isEmpty ? 'empty' : ''}`} onClick={e => toggleAdd(e)}>
          <span className="text">+</span>
        </div>
        {!isEmpty ? <HypercubeTable app={app} onHeaderClick={data => onHeaderClick(data)} dimensions={dimensions} measures={measures} height={28 * 8} maxWidth={100 * 8} /> : null}
      </div>
    </div>
  );
}

Cube.defaultProps = {
  closeOnClickOutside: () => true,
};

Cube.propTypes = {
  app: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  closeOnClickOutside: PropTypes.func,
};
