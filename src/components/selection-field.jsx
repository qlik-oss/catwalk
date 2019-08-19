import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLayout, useModel } from 'hamus.js';
import Field from './field';
import Filterbox from './filterbox';
import useClickOutside from './use/click-outside';
import useResolvedValue from './use/resolved-value';
import './selection-field.pcss';

const createDefinition = (field) => ({
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


export default function SelectionField({
  app, field, fieldData,
}) {
  const selfRef = useRef(null);
  const [showFilterbox, setShowFilterbox] = useState(false);
  const model = useResolvedValue(useModel(app, createDefinition(field)));
  const layout = useResolvedValue(useLayout(model));

  function useVisible(ref, callback) {
    useEffect(() => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elem = document.elementFromPoint(rect.left, rect.top);
        const isVisible = ref.current === elem;
        callback(isVisible);
      }
    });
  }

  useVisible(selfRef, (isVisible) => {
    if (!isVisible && showFilterbox) {
      setShowFilterbox(!showFilterbox);
    }
  });

  const onClick = () => {
    setShowFilterbox(!showFilterbox);
  };

  const onClearSelection = async (event) => {
    event.stopPropagation();
    if (app) {
      const fieldObject = await app.getField(field);
      try {
        await fieldObject.clear();
      } catch (err) {
        app.abortModal(true);
        fieldObject.clear();
      }
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
