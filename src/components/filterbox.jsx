import ReactDOM from 'react-dom';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'react-virtualized';
import useClickOutside from './use/click-outside';
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
rowRenderer.propTypes = {
  defaultProps: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
};

function noRowsRenderer() {
  return <div className="no-values">No values</div>;
}
function useSelections(model, layout, selfRef) {
  const ongoingSelections = useRef(false);
  const [, forceUpdate] = useState(null);

  const onRowClick = async ({ rowData }) => {
    if (rowData) {
      const rowDataToModify = rowData;
      if (rowData[0].qState !== 'S' && rowData[0].qState !== 'XS') {
        rowDataToModify[0].qState = 'S'; // For fast visual feedback, this will be overwritten when the new layout comes.
      } else {
        rowDataToModify[0].qState = 'A'; // For fast visual feedback, this will be overwritten when the new layout comes.
      }
      const wasAlreadyInSelections = layout.qSelectionInfo.qInSelections;
      const layoutz = layout;
      layoutz.qSelectionInfo.qInSelections = true;
      ongoingSelections.current = true;
      forceUpdate(Date.now());

      if (!wasAlreadyInSelections) {
        model.beginSelections(['/qListObjectDef']).catch(() => {
          // If the object (model) is already in modal state, the call to beginSelections will return an error.
          // To reset the modal state we call abortModal, and retry the beginSelections call immediately followed
          // by the selections. If we wait for the beginSelections to return, there will be a layout update
          // resetting the "fast visual feedback" state (set a couple of lines up) which will be visually perceived
          // as a blink of the green color.
          ReactDOM.unstable_batchedUpdates(() => {
            model.session.app.abortModal(true);
            model.beginSelections(['/qListObjectDef']);
            model.selectListObjectValues('/qListObjectDef', [rowData[0].qElemNumber], true);
          });
        });
      }
      model.selectListObjectValues('/qListObjectDef', [rowData[0].qElemNumber], true).catch(() => {
      // If the object (model) is already in modal state, the call to selectListObjectValues will return
      // an error. The call to selectListObjectValues will be retried in the batchedUpdates call (a couple
      // of lines above).
      });
    }
  };

  useClickOutside(selfRef, ongoingSelections.current, () => {
    ongoingSelections.current = false;
    model.endSelections(true);
  });

  return { onRowClick };
}

function useSearch(model, selfRef, inputRef) {
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

  useClickOutside(selfRef, ongoingSearch.current, () => {
    ongoingSearch.current = false;
    const inputRefRef = inputRef;
    inputRefRef.current.value = '';
    model.abortListObjectSearch('/qListObjectDef');
  });

  return { onSearch };
}

export default function Filterbox({ model, layout }) {
  const selfRef = useRef(null);
  const inputRef = useRef(null);
  const { onRowClick } = useSelections(model, layout, selfRef);
  const { onSearch } = useSearch(model, selfRef, inputRef);

  if (!layout || !layout.qListObject.qDataPages || !layout.qListObject.qDataPages.length) {
    return null;
  }

  let classes = 'filterbox';
  if (layout.qSelectionInfo.qInSelections) {
    classes += ' made-selections';
  }

  return (
    <div role="listbox" tabIndex="-1" className={classes} onClick={preventDefaultFn} ref={selfRef}>
      <input
        ref={inputRef}
        onKeyUp={onSearch}
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
