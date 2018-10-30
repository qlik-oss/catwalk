import React, { useRef, useState, useEffect } from 'react';
import {
  Table, AutoSizer, InfiniteLoader,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import PropTypes from 'prop-types'; // only needs to be imported once

function wrappingRowRenderer(inputParams, rowRenderer) {
  const {
    index,
    onRowClick,
    onRowDoubleClick,
    onRowMouseOut,
    onRowMouseOver,
    onRowRightClick,
    rowData,
  } = inputParams;

  const a11yProps = { 'aria-rowindex': index + 1 };

  if (
    onRowClick
    || onRowDoubleClick
    || onRowMouseOut
    || onRowMouseOver
    || onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({ event, index, rowData });
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData });
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData });
    }
  }
  return rowRenderer({ defaultProps: a11yProps, ...inputParams });
}

/* function getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.layout !== prevState.layout) {
    // console.log('New state');
    const newState = { layout: nextProps.layout, loadedRowsMap: {}, lastLoadedRowsMap: prevState.loadedRowsMap };
    newState.layout.qListObject.qDataPages[0].qMatrix.forEach((row, i) => {
      newState.loadedRowsMap[i] = row;
    });
    return newState;
  }
  return null;
} */

export function VirtualTable({
  model, layout, onRowClick, rowRenderer, noRowsRenderer, children,
}) {
  const infiniteLoaderRef = useRef(null);
  const [table, setTable] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [loadedRowsMap, setLoadedRowsMap] = useState([]);
  const [lastLoadedRowsMap, setLastLoadedRowsMap] = useState([]);

  useEffect(() => {
    if (scrollTop > 0) {
      this.infiniteLoaderRef.current.resetLoadMoreRowsCache(true); // Probably not needed
      this.table.forceUpdate();
    }
  }, [scrollTop]);

  const onScroll = ({ _scrollTop }) => setScrollTop(_scrollTop);
  const getRow = ({ index }) => loadedRowsMap[index] || lastLoadedRowsMap[index];
  const isRowLoaded = ({ index }) => !!loadedRowsMap[index];
  const loadMoreRows = async ({ startIndex, stopIndex }) => {
    const result = await model.getListObjectData('/qListObjectDef', [{
      qTop: startIndex,
      qHeight: stopIndex - startIndex + 1,
      qLeft: 0,
      qWidth: 1,
    }]);
    const top = result[0].qArea.qTop;
    const loadedRows = result[0].qMatrix;
    loadedRows.forEach((row, index) => {
      loadedRowsMap[top + index] = row;
    });
    setLastLoadedRowsMap(loadedRowsMap);
    setLoadedRowsMap(loadedRowsMap);
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={layout.qListObject.qSize.qcy}
          threshold={3}
          minimumBatchSize={100}
          ref={infiniteLoaderRef}
        >
          {({ onRowsRendered, registerChild }) => {
            const grab = (tbl) => { if (table !== tbl) setTable(tbl); registerChild(tbl); };
            return (
              <Table
                height={height}
                width={width}
                ref={grab}
                onRowsRendered={onRowsRendered}
                disableHeader
                rowHeight={24}
                rowCount={layout.qListObject.qSize.qcy}
                rowGetter={getRow}
                tabIndex={null}
                onRowClick={onRowClick}
                onScroll={onScroll}
                rowRenderer={params => wrappingRowRenderer(params, rowRenderer)}
                noRowsRenderer={noRowsRenderer}
              >
                {children}
              </Table>
            );
          }}
        </InfiniteLoader>)
      }
    </AutoSizer>
  );
}

VirtualTable.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  layout: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
  rowRenderer: PropTypes.func.isRequired,
  noRowsRenderer: PropTypes.func,
};

VirtualTable.defaultProps = {
  onRowClick: () => {},
  noRowsRenderer: null,
};

export default VirtualTable;
