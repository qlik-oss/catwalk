import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Field from './field';
import Filterbox from './filterbox';
import useModel from './use/model';
import useLayout from './use/layout';
import './table-field.pcss';
import './selection-field.pcss';

function SelectionFieldWithoutState({
  model, layout, field, fieldData,
}) {
  const [showFilterbox, setShowFilterbox] = useState(false);

  const onClick = () => {
    setShowFilterbox(!showFilterbox);
  };

  return (
    <div className="popover-wrapper">
      <div
        className="selectionfield"
        onClick={onClick}
        tabIndex="-1"
        role="button"
      >
        <Field layout={layout} field={field} fieldData={fieldData} showCancel />
      </div>
      { showFilterbox
        ? (
          <div className="popover-content">
            <Filterbox model={model} layout={layout} field={field} showFilterbox={showFilterbox} />
          </div>
        ) : null}
    </div>
  );
}

SelectionFieldWithoutState.propTypes = {
  model: PropTypes.object,
  layout: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
};

SelectionFieldWithoutState.defaultProps = {
  model: null,
  layout: null,
  fieldData: null,
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

export default function SelectionField({
  app, field, fieldData,
}) {
  const model = useModel(app, createDefinition(field));
  const layout = useLayout(model);

  return SelectionFieldWithoutState({
    model, layout, field, fieldData,
  });
}
