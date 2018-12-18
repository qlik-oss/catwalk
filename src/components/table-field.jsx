import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';
import Field from './field';
import Filterbox from './filterbox';
import useModel from './use/model';
import useLayout from './use/layout';


import './table-field.pcss';
import './tooltip.pcss';

function TableFieldWithoutState({
  model, layout, field, fieldData, showFilterbox,
}) {
  let classes = `table-field ${fieldData.qKeyType}`;

  if (!layout) {
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

  if (states.qSelected) {
    classes += ' filtered';
  }

  if (fieldData.qHasDuplicates) {
    classes += ' has-duplicates';
  }
  if (fieldData.qHasNull) {
    classes += ' has-null';
  }

  const allExcluded = states.qExcluded === total;
  const singleHit = states.qExcluded === total - 1;

  if (allExcluded) {
    classes += ' all-excluded';
  }

  if (singleHit) {
    classes += ' single-hit';
  }

  const tooltipData = (`${fieldData.srcTable.qName}${fieldData.qName}`);
  const isSynthetic = (fieldData.qTags && fieldData.qTags.find(item => item === '$synthetic'));
  if (isSynthetic) {
    const syntheticFieldStyle = {
      border: `2px dashed ${fieldData.backgroundColor}`,
    };

    return (
      <div
        className={classes}
        style={syntheticFieldStyle}
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

    >
      <Field layout={layout} field={field} fieldData={fieldData} />
      <div className="extra-information">
        <div id={tooltipData} data-tooltip={tooltipData}>
          <SVGInline className="extra-information-icon" svg={moreHorizontalOutline} />
        </div>
      </div>
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
  const fieldDataToModify = fieldData;
  fieldDataToModify.layout = layout;
  return TableFieldWithoutState({
    model, layout, field, fieldData, showFilterbox,
  });
}
