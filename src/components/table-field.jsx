import React from 'react';
import PropTypes from 'prop-types';
import Field from './field';
import Filterbox from './filterbox';
import useModel from './use/model';
import useLayout from './use/layout';

import './table-field.pcss';

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

function TableFieldWithoutState({
  model, layout, field, fieldData, showFilterbox,
}) {
  let classes = `table-field ${fieldData.qKeyType}`;

  if (!layout || !layout.qListObject || !layout.qListObject.qDataPages[0]) {
    return (
      <div
        className={classes}
      >
        <div className="name">
          {field}
        </div>
      </div>
    );
  }

  const total = layout.qListObject.qDimensionInfo.qCardinal;
  const states = layout.qListObject.qDimensionInfo.qStateCounts;
  let descriptions = '';

  if (states.qSelected) {
    classes += ' filtered';
  }

  if (fieldData.qHasDuplicates) {
    classes += ' has-duplicates';
    descriptions += 'Duplicate values';
  } else {
    descriptions += 'Unique values';
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

  const filterBox = showFilterbox ? <Filterbox model={model} layout={layout} field={field} /> : null;

  return (
    <div
      className={classes}
      style={fieldStyle}
      title={`${field} \n\n${states.qSelected} selected, ${states.qOption
        + states.qAlternative} possible, ${
        states.qExcluded
      } excluded, total of ${total} values. ${descriptions}\n\n${firstFewValues(layout)}`}
    >
      <Field layout={layout} field={field} fieldData={fieldData} />
      <div className="details">
        { filterBox }
      </div>
    </div>
  );
}

TableFieldWithoutState.propTypes = {
  model: PropTypes.object,
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
  showFilterbox: PropTypes.bool,
};

TableFieldWithoutState.defaultProps = {
  model: null,
  layout: null,
  fieldData: null,
  showFilterbox: false,
};

const createDefinition = field => ({
  qInfo: { qType: 'dmi-field' },
  qListObjectDef: {
    qFrequencyMode: 'V',
    qDef: {
      qFieldDefs: [field],
      qSortCriterias: [
        {
          // qSortByState: 1,
          qSortByFrequency: 1,
          // qSortByNumeric: 1,
          // qSortByAscii: 1,
          // qSortByLoadOrder: 1,
        },
      ],
    },
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 10,
        qWidth: 1,
      },
    ],
  },
});

export default function TableField({
  app, field, fieldData, showFilterbox,
}) {
  const model = useModel(app, createDefinition(field));
  const layout = useLayout(model);

  return TableFieldWithoutState({
    model, layout, field, fieldData, showFilterbox,
  });
}
