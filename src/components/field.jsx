import React from 'react';
import PropTypes from 'prop-types';

import withApp from './with-app';
import withModel from './with-model';
import withLayout from './with-layout';

import './field.scss';

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

export const Field = (props) => {
  const {
    field, fieldData, layout,
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

  const name = (
    <div className="name">
      <div>{field}</div>
    </div>
  );

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
      } excluded, total of ${total} values. ${descriptions}`}
    >
      {name}
      <div className="bartext">
        {' '}
        {fieldCounts(layout.qListObject.qDimensionInfo, fieldData)}
      </div>
      <div className="gwg">
        <span className="green" style={green} />
        <span className="grey" style={grey} />
      </div>
    </div>
  );
};

Field.propTypes = {
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
};

Field.defaultProps = {
  layout: null,
  fieldData: null,
};

export default withApp(withModel(withLayout(Field), async (app, props) => app.getOrCreateListbox(props.field)));
