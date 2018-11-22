import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Field from './field';
import Filterbox from './filterbox';
import useModel from './use/model';
import useLayout from './use/layout';
import useClickOutside from './use/click-outside';
import './selection-field.pcss';

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
  const selfRef = useRef(null);
  const [showFilterbox, setShowFilterbox] = useState(false);
  const model = useModel(app, createDefinition(field));
  const layout = useLayout(model);

  const onClick = () => {
    setShowFilterbox(!showFilterbox);
  };

  const onClearSelection = async (event) => {
    event.stopPropagation();
    if (app) {
      const fieldObject = await app.getField(field);
      fieldObject.clear();
    }
  };

  useClickOutside(selfRef, showFilterbox, () => {
    model.endSelections(true);
    setShowFilterbox(false);
  });

  let positioning = {};
  if (selfRef && selfRef.current) {
    positioning = { left: `${selfRef.current.getBoundingClientRect().left}px` };
  }

  const filterBox = showFilterbox
    ? (
      <div className="popover-content" style={positioning}>
        <Filterbox model={model} layout={layout} field={field} />
      </div>
    ) : null;

  return (
    <div className="popover-wrapper" ref={selfRef}>
      <div
        className="selection-field"
        onClick={onClick}
        tabIndex="-1"
        role="button"

      >
        <Field layout={layout} field={field} fieldData={fieldData} onClearSelection={onClearSelection} />
      </div>
      { filterBox }
    </div>
  );
}

SelectionField.propTypes = {
  app: PropTypes.object,
  field: PropTypes.string.isRequired,
  fieldData: PropTypes.object,
};

SelectionField.defaultProps = {
  app: null,
  fieldData: null,
};
