import React from 'react';
import PropTypes from 'prop-types';

import './field2.scss';

function makeRandomSelection(model) {
  model.getLayout().then((layout) => {
    if (layout.qListObject.qDataPages[0].qMatrix) {
      const possible = layout.qListObject.qDataPages[0].qMatrix.filter(i => i[0].qState === 'O').map(i => i[0].qElemNumber);
      model.selectListObjectValues('/qListObjectDef', possible.slice(0, possible.length * Math.random()), true);
    } else {
      console.log('No qMatrix', model);
    }
  });
}

function fieldText(fieldName, dimInfo) {
  let text = fieldName;
  return text;
  // if (!dimInfo) {
  //   return fieldName;
  // }
  // if (dimInfo.qTags.indexOf('$integer') >= 0) {
  //   text = `# ${text}`;
  // } else if (dimInfo.qTags.indexOf('$numeric') >= 0) {
  //   text = `$ ${text}`;
  // } else if (dimInfo.qTags.indexOf('$text') >= 0) {
  //   text = `α ${text}`;
  // } else {
  //   text += '';
  // }
  // return text;
}

function fieldCounts(dimInfo, field) {
  let str = '';
  if (field.qnPresentDistinctValues !== field.qnTotalDistinctValues) {
    str = `${dimInfo.qStateCounts.qSelected + dimInfo.qStateCounts.qOption} of ${field.qnTotalDistinctValues}(${field.qnPresentDistinctValues})`;
  } else {
    str = `${dimInfo.qStateCounts.qSelected + dimInfo.qStateCounts.qOption} of ${field.qnPresentDistinctValues}`;
  }

  return str;
}

export default class Field2 extends React.Component {
  constructor() {
    super();
    this.boundRefresh = this.refresh.bind(this);
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
    model.getLayout().then(layout => this.setState({ layout }));
  }

  render() {
    const { field, fieldData, onlyBar } = this.props;
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

    let classes = `field2 ${fieldData.qKeyType}`;

    let descriptions = '';
    if (states.qSelected) {
      classes += ' filtered';
    }

    if (fieldData.qHasDuplicates) {
      classes += ' has-duplicates';
      descriptions += '. Duplicate values';
    } else {
      descriptions += '. Unique values';
    }

    if (fieldData.qHasNull) {
      classes += ' has-null';
      descriptions += ', has nulls';
    } else {
      descriptions += ', no nulls.';
    }

    const name = (
      <div className="name">
        <div>{fieldText(field, layout.qListObject.qDimensionInfo)}</div>
      </div>
    );
    const bar = (
      <div className="gwg" title={`${states.qSelected} selected, ${states.qOption + states.qAlternative} possible, ${states.qExcluded} excluded, total of ${total} values. ${descriptions}`}>
        <span className="green" style={green} />
        <span className="grey" style={grey} />
        <div className="bartext">
          {' '}
          {fieldCounts(layout.qListObject.qDimensionInfo, fieldData)}
        </div>
      </div>
    );
    if (onlyBar) {
      return bar;
    }
    //
    // let sub;
    // if (fieldData.qnPresentDistinctValues < fieldData.qnTotalDistinctValues) {
    //   sub = (
    //     <div className="sub">
    //       <span>{fieldData.qnPresentDistinctValues}</span>
    //       <span>&#8703;</span>
    //       <span>{fieldData.qnTotalDistinctValues}</span>
    //     </div>
    //   );
    // } else {
    //   sub = null;
    // }

    const fieldStyle = {
      backgroundColor: fieldData.backgroundColor,
    };
    return (
      <div>
        <div className={classes} style={fieldStyle}>
          {name}
          {bar}
        </div>
      </div>
    );
  }
}

Field2.propTypes = {
  app: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object.isRequired,
  onlyBar: PropTypes.bool,
};

Field2.defaultProps = {
  onlyBar: false,
};
