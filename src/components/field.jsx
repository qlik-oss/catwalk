import React from 'react';
import PropTypes from 'prop-types';

import './field.css';

function makeRandomSelection(model) {
  model.getLayout().then((layout) => {
    const possible = layout.qListObject.qDataPages[0].qMatrix.filter(i => i[0].qState === 'O').map(i => i[0].qElemNumber);
    model.selectListObjectValues('/qListObjectDef', possible.slice(0, possible.length * Math.random()), true);
  });
}

export default class Field extends React.Component {
  constructor(props) {
    super();
    this.boundRefresh = this.refresh.bind(this);
    this.changeCallback = props.onChange;
    this.state = {
      layout: null,
    };
  }

  componentWillMount() {
    const { app, field } = this.props;
    app.getOrCreateListbox(field).then((model) => {
      if (!process.env.ENGINE_URL && Math.random() > 0.8) {
        makeRandomSelection(model);
      }
      this.setState({ model });
      model.on('changed', this.boundRefresh);
      this.refresh();
    });
  }

  componentWillUnmount() {
    const { model } = this.state;
    model.removeListener('changed', this.boundRefresh);
    // Make sure pending promises doesn't trigger any internal
    // react logic after we're unmounted. It's either this,
    // or wrapping all promises so that we can reject them...
    this.setState = () => {};
  }

  refresh() {
    const { model } = this.state;
    model.getLayout().then((layout) => {
      this.setState({ layout });
      if (this.changeCallback) {
        this.changeCallback(layout.qListObject.qDimensionInfo.qStateCounts);
      }
    });
  }

  render() {
    const { field, onlyBar } = this.props;
    const { layout } = this.state;
    if (!layout) {
      return null;
    }
    // there is currently no cardinal value that is unaffected by
    // the search, see https://jira.qlikdev.com/browse/QLIK-89627:
    const total = layout.qListObject.qDimensionInfo.qCardinal;
    const states = layout.qListObject.qDimensionInfo.qStateCounts;
    const green = { width: `${Math.ceil(states.qSelected / total * 100)}%` };
    const grey = { width: `${Math.ceil(states.qExcluded / total * 100)}%` };
    const name = (
      <span className="name">
        {field}
      </span>
    );
    const bar = (
      <span className="gwg" title={`${states.qSelected} selected, ${states.qOption + states.qAlternative} possible, ${states.qExcluded} excluded, total of ${total} values.`}>
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
