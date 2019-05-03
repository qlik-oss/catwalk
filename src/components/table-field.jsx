import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import { useLayout, useModel } from 'hamus.js';
import moreHorizontalOutline from '../assets/more-horizontal-outline.svg';
import Field from './field';
import Filterbox from './filterbox';
import { getTooltipForField, getTooltipForSyntheticField } from './tooltip';

import './table-field.pcss';
import './tooltip.pcss';

function TableFieldWithoutState({
  model, layout, field, fieldData, showFilterbox,
}) {
  let classes = `table-field ${fieldData.qKeyType}`;

  const isSynthetic = (fieldData.qTags && fieldData.qTags.find(item => item === '$synthetic'));
  if (isSynthetic) {
    const syntheticFieldStyle = {
      border: `2px dashed ${fieldData.backgroundColor}`,
    };

    return (
      <div
        className={classes}
        style={syntheticFieldStyle}
        title={getTooltipForSyntheticField(fieldData, layout)}
      >
        <div className="name">
          {field}
        </div>
      </div>
    );
  }

  if (!layout || !layout.qListObject || !layout.qListObject.qDataPages || !layout.qListObject.qDataPages[0]) {
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

  const stroke = fieldData.srcTable.qLoose ? 'dashed' : 'solid';
  const fieldStyle = {
    border: `2px ${stroke} ${fieldData.backgroundColor}`,
  };

  const filterBox = showFilterbox ? <Filterbox model={model} layout={layout} field={field} /> : null;
  return (
    <div
      className={classes}
      style={fieldStyle}
      title={getTooltipForField(fieldData, layout)}
    >
      <Field layout={layout} field={field} fieldData={fieldData} />
      <div className="extra-information" title="Click for more information">
        <div data-extra-info-icon>
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
    qShowAlternatives: true,
    qDef: {
      qFieldDefs: [field],
      qSortCriterias: [
        {
          qSortByState: 1,
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
  const [model, modelError] = useModel(app, createDefinition(field));
  if (modelError) {
    throw modelError;
  }
  const [layout, layoutError] = useLayout(model);
  if (layoutError) {
    throw layoutError;
  }
  const fieldDataToModify = fieldData;
  fieldDataToModify.layout = layout;
  return TableFieldWithoutState({
    model, layout, field, fieldData, showFilterbox,
  });
}
