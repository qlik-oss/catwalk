import React from 'react';
import PropTypes from 'prop-types';

import withApp from './with-app';
import withModel from './with-model';
import withLayout from './with-layout';

import './field.scss';
import Filterbox from './filterbox';

function fieldCounts(dimInfo, field) {
  let str = '';
  if (!field.qnTotalDistinctValues) {
    str = `${dimInfo.qStateCounts.qSelected
    + dimInfo.qStateCounts.qOption} of ${dimInfo.qCardinal}`;
  } else if (field.qnPresentDistinctValues !== field.qnTotalDistinctValues) {
    str = `${dimInfo.qStateCounts.qSelected
    + dimInfo.qStateCounts.qOption} of ${field.qnTotalDistinctValues}(${
      field.qnPresentDistinctValues
    })`;
  } else {
    str = `${dimInfo.qStateCounts.qSelected
    + dimInfo.qStateCounts.qOption} of ${field.qnPresentDistinctValues}`;
  }
  return str;
}

function firstFewValues(layout) {
  const rowToText = row => `${row[0].qText || '<empty>'}`;

  const selected = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'S' || row[0].qState === 'O');
  const excluded = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'X');

  let result = '';
  if (selected.length > 0) {
    result += `Example values:\n${selected.map(rowToText).join(', ')}\n`;
  }
  if (excluded.length > 0) {
    result += `\nExample of excluded values:\n${excluded.map(rowToText).join(', ')}`;
  }

  return result;
}

export function Field(props) {
  const {
    field, fieldData, layout, showFilterbox, model,
  } = props;
  if (!layout) {
    return null;
  }

  const total = layout.qListObject.qDimensionInfo.qCardinal;
  const states = layout.qListObject.qDimensionInfo.qStateCounts;
  const green = { width: `${Math.ceil((states.qSelected / total) * 100)}%` };
  const grey = { width: `${Math.ceil((states.qExcluded / total) * 100)}%` };
  let classes = `field ${fieldData.qKeyType}`;

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

  const allExcluded = states.qExcluded === total;
  const singleHit = states.qExcluded === total - 1;

  if (allExcluded) {
    classes += ' all-excluded';
  }

  if (singleHit) {
    classes += ' single-hit';
  }

  const isSynthetic = (fieldData.qTags && fieldData.qTags.find(item => item === '$synthetic'));
  if (isSynthetic) {
    const syntheticFieldStyle = {
      border: `2px dashed ${fieldData.backgroundColor}`,
    };

    return (
      <div
        className={classes}
        style={syntheticFieldStyle}
        title="Synthetic key"
      >
        <div className="name">
          {field}
        </div>
      </div>
    );
  }

  const fieldStyle = {
    border: `2px solid ${fieldData.backgroundColor}`,
  };
  return (
    <div
      className={classes}
      style={fieldStyle}
      title={`${states.qSelected} selected, ${states.qOption
        + states.qAlternative} possible, ${
        states.qExcluded
      } excluded, total of ${total} values. ${descriptions}\n\n${firstFewValues(layout)}`}
    >
      <div className="name">
        {field}
      </div>
      <div className="bartext">
        {' '}
        {fieldCounts(layout.qListObject.qDimensionInfo, fieldData)}
      </div>
      <div className="gwg">
        <span className="green" style={green} />
        <span className="grey" style={grey} />
      </div>
      { showFilterbox ? <div className="details"><Filterbox model={model} layout={layout} /></div> : null}
    </div>
  );
}
Field.propTypes = {
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  fieldData: PropTypes.object,
  showFilterbox: PropTypes.bool,
};

Field.defaultProps = {
  layout: null,
  fieldData: null,
  showFilterbox: false,
};


export default withApp(withModel({ WrappedComponent: withLayout(Field), createModel: async (app, props) => app.getOrCreateListbox(props.field) }));
