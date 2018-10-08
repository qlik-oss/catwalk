import React from 'react';
import PropTypes from 'prop-types';

import withModel from './withModel';
import withLayout from './withLayout';

import './field.css';

function makeRandomSelection(model) {
  console.log('modelCreatedcallback');
  // model.getLayout().then((layout) => {
  //   const possible = layout.qListObject.qDataPages[0].qMatrix
  //     .filter(i => i[0].qState === 'O')
  //     .map(i => i[0].qElemNumber);
  //   model.selectListObjectValues(
  //     '/qListObjectDef',
  //     possible.slice(0, possible.length * Math.random()),
  //     true,
  //   );
  // });
}

class Field extends React.Component {
  constructor(props) {
    super();
    // this.boundRefresh = this.refresh.bind(this);
    // this.changeCallback = props.onChange;
    // this.state = {
    //   layout: null,
    // };
  }

  // componentWillMount() {
  //   const { app, field } = this.props;
  //   app.getOrCreateListbox(field).then((model) => {
  //     if (!process.env.ENGINE_URL && Math.random() > 0.8) {
  //       makeRandomSelection(model);
  //     }
  //     this.setState({ model });

  //     model.on('changed', this.boundRefresh);
  //     this.refresh();
  //   });
  // }

  // componentWillUnmount() {
  //   const { model } = this.props;
  //   model.removeListener('changed', this.boundRefresh);
  //   // Make sure pending promises doesn't trigger any internal
  //   // react logic after we're unmounted. It's either this,
  //   // or wrapping all promises so that we can reject them...
  //   this.setState = () => {};
  // }

  // refresh() {
  //   // layoutcallback
  //   const { model } = this.props;
  //   model.getLayout().then((layout) => {
  //     this.setState({ layout });
  //     if (this.changeCallback) {
  //       this.changeCallback(layout.qListObject.qDimensionInfo.qStateCounts);
  //     }
  //   });
  // }

  render() {
    const { field, onlyBar, layout } = this.props;
    if (!layout) {
      return null;
    }
    // there is currently no cardinal value that is unaffected by
    // the search, see https://jira.qlikdev.com/browse/QLIK-89627:
    const total = layout.qListObject.qDimensionInfo.qCardinal;
    const states = layout.qListObject.qDimensionInfo.qStateCounts;
    const green = { width: `${Math.ceil((states.qSelected / total) * 100)}%` };
    const grey = { width: `${Math.ceil((states.qExcluded / total) * 100)}%` };
    const name = <span className="name">{field}</span>;
    const bar = (
      <span
        className="gwg"
        title={`${states.qSelected} selected, ${states.qOption + states.qAlternative} possible, ${
          states.qExcluded
        } excluded, total of ${total} values.`}
      >
        <span className="green" style={green} />
        <span className="grey" style={grey} />
      </span>
    );
    if (onlyBar) {
      return bar;
    }
    return (
      <div className={`field${states.qSelected ? ' filtered' : ''}`}>
        {name}
        {bar}
      </div>
    );
  }
}

Field.propTypes = {
  app: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onlyBar: PropTypes.bool,
};

Field.defaultProps = {
  onChange: null,
  onlyBar: false,
};

export default withModel(
  withLayout(Field, (layout, props) => {
    if (props.onChange) {
      props.onChange(layout.qListObject.qDimensionInfo.qStateCounts);
    }
  }),
  async (app, props) => await app.getOrCreateListbox(props.field),
);
