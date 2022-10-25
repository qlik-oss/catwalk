import React from 'react';
import PropTypes from 'prop-types';
import SVGClose from '../assets/close-outline.svg';
import { getSelectionBarTooltip } from './tooltip';
import './field.pcss';

const clearButton = { className: 'clear-selection', svg: SVGClose };

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
  const showClearSelection = onClearSelection !== null && !layout.qListObject.qDimensionInfo.qIsOneAndOnlyOne;
  const clearSelection = showClearSelection
    ? (
      <SVGClose className={clearButton.className} onClick={(event) => { onClearSelection(event, field); }} />
    ) : null;
  return (
    <div className="field">
      <div className="inner-container">
        <div className="name-and-text">
          <div className="name">
            {field}
          </div>
          <div className="bartext" title={getSelectionBarTooltip(fieldData, layout)}>
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
