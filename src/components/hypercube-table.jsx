import React from 'react';
import PropTypes from 'prop-types';
import Column from 'react-virtualized/dist/es/Table/Column';
import VirtualTable from './virtual-table';
import './hypercube-table.scss';

const KEY_ENTER = 13;

function preventDefaultFn(event) {
  event.stopPropagation();
}
function cellGetterForIndex(index) {
  return function cellGetter({ rowData }) {
    if (!rowData || !rowData[index]) {
      return '';
    }
    return rowData[index].qText;
  };
}


function cellRendererForIndex(index) {
  function cellRenderer({ rowData }) {
    if (!rowData || !rowData[index]) {
      return (<div>...</div>);
    }
    let title;
    if (!rowData[index].qNum || rowData[index].qNum === 'NaN') {
      title = `'${rowData[index].qText || ''}' (No numerical representation)`;
    } else {
      title = `'${rowData[index].qText}' (Numerical representation: ${rowData[index].qNum})`;
    }
    return (
      <div title={title}>
        {rowData[index].qText ? rowData[index].qText : '< empty >'}
      </div>
    );
  }
  cellRenderer.propTypes = {
    rowData: PropTypes.object.isRequired,
  };
  return cellRenderer;
}


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

function headerRowRenderer({
  className, columns, style,
}) {
  console.log('Rendering header');
  return (
    <div
      className={className}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );
}
headerRowRenderer.propTypes = {
  className: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
};

function noRowsRenderer() {
  return <div className="no-values">No values</div>;
}

export class HypercubeTable extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.selfRef = React.createRef();
  }

  async componentWillReceiveProps() {
    const { app, measure, dimensions } = this.props;

    const hypercubeProps = {
      qInfo: {
        qId: 'measurebox1',
        qType: 'measurebox1',
      },
      qHyperCubeDef: {
        qMeasures: [{
          qLibraryId: measure.qInfo.qId,
        }],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qHeight: 50,
            qWidth: dimensions.length + 1,
          },
        ],
      },
    };

    if (dimensions.length > 0) {
      hypercubeProps.qHyperCubeDef.qDimensions = dimensions.map(fieldName => ({ qDef: { qFieldDefs: [fieldName] } }));
    } else {
      hypercubeProps.qHyperCubeDef.qDimensions = [];
    }

    if (!this.object) {
      console.log('Creating object');
      this.object = await app.createSessionObject(hypercubeProps);
    } else {
      console.log('Setting properties', hypercubeProps);
      await this.object.setProperties(hypercubeProps);
    }
    const layout = await this.object.getLayout();
    this.setState({ layout, object: this.object });
    console.log(layout);
  }

  componentWillUnmount() {
  }

  render() {
    const { measure, dimensions } = this.props;
    const { layout, object } = this.state;
    if (layout) {
      return (
        <div role="Table" tabIndex="-1" className="hypercube-table" ref={this.selfRef}>
          <div className="virtualtable">
            <VirtualTable
              layout={layout}
              model={object}
              onRowClick={this.onRowClick}
              rowRenderer={rowRenderer}
              noRowsRenderer={noRowsRenderer}
              headerRowRenderer={headerRowRenderer}
              headerRowHeight={24}
              defPath="/qHyperCubeDef"
            >
              {dimensions.map((dimName, index) => (
                <Column
                  label={dimName}
                  dataKey={dimName}
                  key={dimName}
                  width={100}
                  flexGrow={1}
                  flexShrink={1}
                  cellDataGetter={cellGetterForIndex(index)}
                  cellRenderer={cellRendererForIndex(index)}
                />
              ))
              }
              <Column
                width={50}
                label={measure.qMeta.title}
                dataKey="measure"
                key="measure"
                flexGrow={1}
                flexShrink={0}
                cellDataGetter={cellGetterForIndex(dimensions.length)}
                cellRenderer={cellRendererForIndex(dimensions.length)}
              />
            </VirtualTable>
          </div>
        </div>
      );
    }
    return (<div />);
  }
}

HypercubeTable.propTypes = {
  measure: PropTypes.object,
  dimensions: PropTypes.arrayOf(PropTypes.string),
  app: PropTypes.object,
};
HypercubeTable.defaultProps = {
  measure: null,
  dimensions: null,
  app: null,
};


export default HypercubeTable;
