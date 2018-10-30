import React from 'react';
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

export class VirtualTable extends React.Component {
  constructor() {
    super();
    this.infiniteLoaderRef = React.createRef();
    this.table = React.createRef();
    const state = {
      loadedRowsMap: {},
      layout: null,
    };
    this.state = state;
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.getRow = this.getRow.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.layout !== prevState.layout) {
      const { layout, defPath } = nextProps;
      const newState = { layout: nextProps.layout, loadedRowsMap: {}, lastLoadedRowsMap: prevState.loadedRowsMap };
      extractNode(layout, defPath).qDataPages[0].qMatrix.forEach((row, i) => {
        newState.loadedRowsMap[i] = row;
      });
      return newState;
    }
    return null;
  }


  componentDidUpdate() {
    // only do this for scrolled components!
    if (this.scrollTop > 0) {
      this.infiniteLoaderRef.current.resetLoadMoreRowsCache(true); // Probably not needed
      this.table.forceUpdate();
    }
  }

  onScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
  }

  getRow({ index }) {
    const { loadedRowsMap, lastLoadedRowsMap } = this.state;
    // console.log('getRow', index, loadedRowsMap[index]);
    return loadedRowsMap[index] || lastLoadedRowsMap[index];
  }

  isRowLoaded({ index }) {
    const { loadedRowsMap } = this.state;
    // console.log('IsRowLoaded', index, loadedRowsMap[index]);
    return !!loadedRowsMap[index];
  }

  async loadQixData(nxPage) {
    const { model } = this.props;
    const { defPath } = this.props;
    if (defPath.endsWith('/qListObjectDef')) {
      return model.getListObjectData(defPath, [nxPage]);
    }
    return model.getHyperCubeData(defPath, [nxPage]);
  }

  async loadMoreRows({ startIndex, stopIndex }) {
    const {
      layout, defPath,
    } = this.props;

    const rootNode = extractNode(layout, defPath);

    // console.log('Load more rows', startIndex, stopIndex);
    const { loadedRowsMap } = this.state;
    const result = await this.loadQixData({
      qTop: startIndex,
      qHeight: stopIndex - startIndex + 1,
      qLeft: 0,
      qWidth: rootNode.qSize.qcx,
    });
    const top = result[0].qArea.qTop;
    const loadedRows = result[0].qMatrix;
    loadedRows.forEach((row, index) => {
      loadedRowsMap[top + index] = row;
    });
  }

  render() {
    const {
      onRowClick, children, rowRenderer, noRowsRenderer, layout, defPath, headerRowRenderer, headerRowHeight,
    } = this.props;

    const rootNode = extractNode(layout, defPath);
    return (
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={rootNode.qSize.qcy}
            threshold={3}
            minimumBatchSize={100}
            ref={this.infiniteLoaderRef}
          >
            {({ onRowsRendered, registerChild }) => {
              const grab = (table) => { this.table = table; registerChild(table); };
              return (

                <Table
                  height={height}
                  width={width}
                  ref={grab}
                  onRowsRendered={onRowsRendered}
                  disableHeader={!headerRowRenderer}
                  rowHeight={24}
                  rowCount={rootNode.qSize.qcy}
                  rowGetter={this.getRow}
                  tabIndex={null}
                  onRowClick={onRowClick}
                  onScroll={this.onScroll}
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

export default VirtualTable;
