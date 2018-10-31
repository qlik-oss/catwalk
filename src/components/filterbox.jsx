import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Column from 'react-virtualized/dist/es/Table/Column';

import VirtualTable from './virtual-table';

import './filterbox.pcss';

const KEY_ENTER = 13;

function preventDefaultFn(event) {
  event.stopPropagation();
}

function listboxNameColumnGetter({ rowData }) {
  return rowData ? rowData[0].qText : '...';
}

function nameCellRenderer({ rowData }) {
  if (!rowData) {
    return (<div>...</div>);
  }
  let title;
  if (!rowData[0].qNum || rowData[0].qNum === 'NaN') {
    title = `'${rowData[0].qText || ''}' (No numerical representation)`;
  } else {
    title = `'${rowData[0].qText}' (Numerical representation: ${rowData[0].qNum})`;
  }
  return (
    <div title={title}>
      {rowData[0].qText ? rowData[0].qText : '< empty >'}
    </div>
  );
}
nameCellRenderer.propTypes = {
  rowData: PropTypes.object.isRequired,
};

function listboxFrequencyColumnGetter({ rowData }) {
  return rowData ? `${rowData[0].qFrequency || '0'}x` : '...';
}

function freqCellRenderer({ rowData }) {
  if (!rowData) {
    return (<div>...</div>);
  }
  if (rowData[0].qState === 'X') {
    return (<div />);
  }

  const freq = rowData[0].qFrequency;
  if (freq && freq > 0) {
    const pluralized = freq > 1 ? 'times ' : 'time';
    return (
      <div title={`This value occurs ${freq} ${pluralized}`}>
        {`${freq}x`}
      </div>
    );
  }
  return (
    <div />
  );
}
freqCellRenderer.propTypes = {
  rowData: PropTypes.object.isRequired,
};

function rowRenderer({
  defaultProps, rowData, style, columns, className, key,
}) {
  const classes = `item state-${rowData ? rowData[0].qState : 'Loading'} ${className}`;
  return (
    <div
      {...defaultProps}
      className={classes}
      key={key}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );
}

function noRowsRenderer() {
  return <div className="no-values">No values</div>;
}

function useSelections(model, selfRef) {
  const [ongoing, setOngoing] = useState(false);
  const [, forceUpdate] = useState(null);

  const onRowClick = ({ rowData }) => {
    if (!ongoing) {
      setOngoing(true);
      model.beginSelections(['/qListObjectDef']);
    }
    if (rowData) {
      if (rowData[0].qState !== 'S') {
        const rowDataToModify = rowData;
        rowDataToModify[0].qState = 'S'; // For fast visual feedback, this will be overwritten when the new layout comes.
      } else {
        const rowDataToModify = rowData;
        rowDataToModify[0].qState = 'O'; // For fast visual feedback, this will be overwritten when the new layout comes.
      }
      forceUpdate(Date.now());
      model.selectListObjectValues('/qListObjectDef', [rowData[0].qElemNumber], true);
    }
  };

  useEffect(() => {
    if (!model || !ongoing) return;

    const onClick = (evt) => {
      if (!selfRef.current.contains(evt.target)) {
        setOngoing(false);
        document.removeEventListener('mouseup', onClick);
        model.endSelections(true);
      }
    };

    document.addEventListener('mouseup', onClick);
  }, [ongoing]);

  return { onRowClick };
}

function useSearch(model) {
  const ongoingSearch = useRef(false);
  const searchTimer = useRef(null);

  const onSearch = (evt) => {
    const { value } = evt.target;
    const { keyCode } = evt;

    if (!ongoingSearch.current) {
      ongoingSearch.current = true;
    }

    if (keyCode === KEY_ENTER) {
      ongoingSearch.current = false;
      model.acceptListObjectSearch('/qListObjectDef', true);
      evt.target.blur();
    } else {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(
        () => model.searchListObjectFor('/qListObjectDef', value),
        300,
      );
    }
  };

  const onSearchCancel = (evt) => {
    const { target } = evt;
    if (ongoingSearch.current) {
      ongoingSearch.current = false;
      target.value = '';
      model.abortListObjectSearch('/qListObjectDef');
    }
  };

  return { onSearch, onSearchCancel };
}

export default function Filterbox({ model, layout }) {
  const selfRef = useRef(null);
  const { onRowClick } = useSelections(model, selfRef);
  const { onSearch, onSearchCancel } = useSearch(model);

  if (!layout || !layout.qListObject.qDataPages || !layout.qListObject.qDataPages.length) {
    return null;
  }

  let classes = 'filterbox';
  if (layout.qSelectionInfo.qMadeSelections) {
    classes += ' made-selections';
  }

  return (
    <div role="Listbox" tabIndex="-1" className={classes} onClick={preventDefaultFn} ref={selfRef}>
      <input
        onKeyUp={onSearch}
        onBlur={onSearchCancel}
        className="search"
        placeholder="Search (wildcard)"
      />
      <div className="virtualtable">
        <VirtualTable
          layout={layout}
          model={model}
          onRowClick={onRowClick}
          rowRenderer={rowRenderer}
          noRowsRenderer={noRowsRenderer}
          defPath="/qListObjectDef"
        >
          <Column
            label="Name"
            dataKey="name"
            width={100}
            flexGrow={1}
            flexShrink={1}
            cellDataGetter={listboxNameColumnGetter}
            cellRenderer={nameCellRenderer}
          />
          <Column
            width={50}
            label="Description"
            dataKey="description"
            flexGrow={1}
            flexShrink={0}
            cellDataGetter={listboxFrequencyColumnGetter}
            cellRenderer={freqCellRenderer}
          />
        </VirtualTable>
      </div>
    </div>
  );
}

Filterbox.defaultProps = {
  model: null,
  layout: null,
};

Filterbox.propTypes = {
  model: PropTypes.object,
  layout: PropTypes.object,
};
