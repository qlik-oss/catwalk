import React from 'react';
import PropTypes from 'prop-types';

import './field.pcss';

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

export default function Field({
  layout, field, fieldData, onClearSelection,
}) {
  if (!layout) {
    return null;
  }

  const total = layout.qListObject.qDimensionInfo.qCardinal;
  const states = layout.qListObject.qDimensionInfo.qStateCounts;
  const green = { width: `${Math.ceil((states.qSelected / total) * 100)}%` };
  const grey = { width: `${Math.ceil((states.qExcluded / total) * 100)}%` };

  const clearSelection = onClearSelection !== null
    ? (
      <div className="clear-selection" tabIndex="-1" role="button" onClick={(event) => { onClearSelection(event, field); }}>
        <i className="x">X</i>
      </div>
    ) : null;

  return (
    <div className="field">
      <div className="inner-container">
        <div className="name-and-text">
          <div className="name">
            {field}
          </div>
          <div className="bartext">
            {' '}
            {fieldCounts(layout.qListObject.qDimensionInfo, fieldData)}
          </div>
        </div>
        {clearSelection}
      </div>
      <div className="gwg">
        <span className="green" style={green} />
        <span className="grey" style={grey} />
      </div>
    </div>
  );
}

Field.propTypes = {
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
  onClearSelection: PropTypes.func,
};

Field.defaultProps = {
  layout: null,
  fieldData: null,
  onClearSelection: null,
};
