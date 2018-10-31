import React, {
  useRef, useState, useEffect, useMemo,
} from 'react';
import {
  Table, AutoSizer, InfiniteLoader,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import PropTypes from 'prop-types'; // only needs to be imported once

function extractNode(layout, defPath) {
  const path = defPath.replace(/\/(.*)Def/, '$1'); // Convert e.g. '/xxx/yyyDef' to 'xxx/yyy'
  return path.split('/').reduce((node, pathItem) => node[pathItem], layout); // Traverse down the nodes for each path item
}

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

export default function VirtualTable({
  model, layout, onRowClick, rowRenderer, noRowsRenderer, children, defPath, headerRowRenderer, headerRowHeight,
}) {
  const debounceId = useRef(0);
  const infiniteLoaderRef = useRef(null);
  const [table, setTable] = useState(null);
  // const [scrollTop, setScrollTop] = useState(0);
  const cachedRows = (useMemo(() => [], layout));

  useEffect(() => {
    clearTimeout(debounceId.current);
    debounceId.current = setTimeout(() => {
      cachedRows.length = 0;
      if (!infiniteLoaderRef || !table) return;
      infiniteLoaderRef.current.resetLoadMoreRowsCache(true); // Probably not needed
      // table.forceUpdate();
    });
  }, [debounceId.current]);

  const onScroll = () => {};// scroll => setScrollTop(scroll.scrollTop);
  const getRow = ({ index }) => cachedRows[index];
  const isRowLoaded = ({ index }) => !!cachedRows[index];

  const loadQixData = async (nxPage) => {
    if (defPath.endsWith('/qListObjectDef')) {
      return model.getListObjectData(defPath, [nxPage]);
    }
    return model.getHyperCubeData(defPath, [nxPage]);
  };
  const loadMoreRows = async ({ startIndex, stopIndex }) => {
    const rootNode = extractNode(layout, defPath);
    const result = await loadQixData({
      qTop: startIndex,
      qHeight: stopIndex - startIndex + 1,
      qLeft: 0,
      qWidth: rootNode.qSize.qcx,
    });
    const top = result[0].qArea.qTop;
    const loadedRows = result[0].qMatrix;
    loadedRows.forEach((row, index) => {
      cachedRows[top + index] = row;
    });
  };
  const rootNode = extractNode(layout, defPath);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rootNode.qSize.qcy}
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
                disableHeader={!headerRowRenderer}
                rowHeight={24}
                rowCount={rootNode.qSize.qcy}
                rowGetter={getRow}
                tabIndex={null}
                onRowClick={onRowClick}
                onScroll={onScroll}
                rowRenderer={params => wrappingRowRenderer(params, rowRenderer)}
                headerRowRenderer={headerRowRenderer}
                headerHeight={headerRowHeight || 0}
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
  headerRowRenderer: PropTypes.func,
  headerRowHeight: PropTypes.number,
  noRowsRenderer: PropTypes.func,
  defPath: PropTypes.string.isRequired,
};

VirtualTable.defaultProps = {
  onRowClick: () => {},
  noRowsRenderer: null,
  headerRowRenderer: null,
  headerRowHeight: null,
};
