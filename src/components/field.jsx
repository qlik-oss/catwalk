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

export function Field(props) {
  const {
    field, fieldData, onlyBar, layout, showFilterbox,
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
      <div className="name">
        {field}
      </div>
      <div className="bartext">
        {' '}
        {fieldCounts(layout.qListObject.qDimensionInfo, fieldData, onlyBar)}
      </div>
      <div className="gwg">
        <span className="green" style={green} />
        <span className="grey" style={grey} />
      </div>
      { showFilterbox ? <div className="details"><Filterbox field={field} /></div> : null}
    </div>
  );
}
Field.propTypes = {
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
  onlyBar: PropTypes.bool,
  showFilterbox: PropTypes.bool,
};

Field.defaultProps = {
  layout: null,
  fieldData: null,
  onlyBar: false,
  showFilterbox: false,
};


export default withApp(withModel(withLayout(Field), async (app, props) => app.getOrCreateListbox(props.field)));
