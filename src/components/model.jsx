import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import usePromise from 'react-use-promise';

import ScrollArea from './scroll-area';
import Field from './field';
import logic from '../logic/logic';
import atplay from '../logic/atplay';

import './model.scss';

function findAttribute(event, attrName) {
  let el = event.target;
  while (!!el && !el.getAttribute(attrName)) {
    el = el.parentElement;
  }

  const field = el && el.getAttribute(attrName);
  return field;
}

function useTablesAndKeys(app, appLayout) {
  const [tablesAndKeys] = usePromise(useMemo(() => app.getTablesAndKeys({}, {}, 0, true, false), [appLayout.qLastReloadTime]));
  return tablesAndKeys;
}

export default function Model({ app, appLayout }) {
  const tablesAndKeys = useTablesAndKeys(app, appLayout);
  const [openBoxes, setOpenBoxes] = useState({});
  const [queryModel, setQueryModel] = useState(null);
  const [atPlayModel, setAtPlayModel] = useState(null);

  useEffect(() => {
    if (!tablesAndKeys) return;
    const newOpenBoxes = {};
    setOpenBoxes(newOpenBoxes);
    const newQueryModel = new logic.QueryModel(tablesAndKeys);
    setQueryModel(newQueryModel);
    const newAtPlayModel = new atplay.AtPlayModel(queryModel, newOpenBoxes);
    setAtPlayModel(newAtPlayModel);
  }, [tablesAndKeys]);

  const toggleField = (evt) => {
    const field = findAttribute(evt, 'fieldz');
    const table = findAttribute(evt, 'tablez');
    if (field) {
      if (openBoxes[field]) {
        delete openBoxes[field];
      } else {
        openBoxes[field] = true;
      }
      const newAtPlayModel = new atplay.AtPlayModel(queryModel, openBoxes);
      setAtPlayModel(newAtPlayModel);
    } else if (table) {
      const newQueryModel = new logic.QueryModel(tablesAndKeys, table);
      setQueryModel(newQueryModel);
    }
  };

  if (!tablesAndKeys || !atPlayModel || !queryModel) {
    return null;
  }

  const assocationsHighlighted = Object.keys(openBoxes).length > 1;
  const gridz = queryModel.resultTableList.map((tableName) => {
    let columnClasses = 'column';
    if (atPlayModel.tablesAtPlay[tableName]) {
      columnClasses += ' tableAtPlay';
    } else if (assocationsHighlighted) {
      columnClasses += ' notTableAtPlay';
    }

    return (
      <div className={columnClasses} key={tableName}>
        <div className="vertcell tableheader" tablez={tableName}>
          <div>{tableName}</div>
          <div className="nbr-of-rows">{queryModel.tables[tableName].qNoOfRows}</div>
        </div>
        <div>
          {queryModel.resultFieldList.map((fieldName) => {
            const isFilterboxOpen = openBoxes[fieldName];
            const cellContainerStyle = {};
            if (isFilterboxOpen) {
              cellContainerStyle.height = '24em';
            }

            const x = queryModel.grid[fieldName][tableName];
            if (x && !x.isEmpty) {
              let classes = 'vertcell keycell';
              if (x.hasAssociationToRight) {
                classes += ' hasAssociationToRight';
              }
              if (x.hasAssociationToLeft) {
                classes += ' hasAssociationToLeft';
              }

              if (atPlayModel.keysAtPlay[fieldName]) {
                classes += ' keyAtPlay';
              } else if (assocationsHighlighted) {
                classes += ' notKeyAtPlay';
              }

              const assocStyle = {
                backgroundColor: x.backgroundColor,
              };


              let leftAssocStyle;
              if (x.cssLeftAssocationBackgroundImage) {
                leftAssocStyle = {
                  backgroundImage: x.cssLeftAssocationBackgroundImage,
                };
              } else {
                leftAssocStyle = {
                  backgroundColor: x.backgroundColor,
                };
              }
              let rightAssocStyle;
              if (x.cssRightAssocationBackgroundImage) {
                rightAssocStyle = {
                  backgroundImage: x.cssRightAssocationBackgroundImage,
                };
              } else {
                rightAssocStyle = {
                  backgroundColor: x.backgroundColor,
                };
              }


              return (
                <div
                  className={classes}
                  style={cellContainerStyle}
                  key={`${tableName}:${fieldName}`}
                  fieldz={fieldName}
                >
                  <Field app={app} field={fieldName} fieldData={x} showFilterbox={isFilterboxOpen} />
                  {x.subsetRatioText ? (
                    <div className="subsetratio" title={x.subsetRatioTitle}>{x.subsetRatioText}</div>
                  ) : null}
                  {x.hasAssociationToLeft ? (
                    <div className="association-to-left" style={assocStyle}>
                      <div className="association-to-left-a" />
                      <div className="association-to-left-b" style={leftAssocStyle} />
                      <div className="association-to-left-c" />
                      <div className="association-to-left-d">{x.assocSymbol}</div>
                    </div>
                  ) : null}
                  {x.hasAssociationToRight ? (
                    <div className="association-to-right" style={assocStyle}>
                      <div className="association-to-right-a" />
                      <div className="association-to-right-b" style={rightAssocStyle} />
                      <div className="association-to-right-c" />
                      <div className="association-to-right-d">{x.assocSymbol}</div>
                    </div>
                  ) : null}

                </div>
              );
            }
            let classes = 'betweener';
            if (x.betweenKeys && !x.isKey) {
              classes += ' betweenKeys';
            }
            if (x.insideTable) {
              classes += ' insideTable';
            }
            if (atPlayModel.keysAtPlay[fieldName] && x.betweenKeys) {
              classes += ' keyAtPlay';
            } else if (assocationsHighlighted) {
              classes += ' notKeyAtPlay';
            }

            const lineystyle = {
              backgroundImage: x.cssBackgroundImage,
            };
            if (x.isBelowKeys) {
              return null;
            }
            return (
              <div className="vertcell" key={`${tableName}:${fieldName}`} style={cellContainerStyle}>
                <div className={classes}>
                  <div
                    className={x.betweenKeys && !x.isKey ? 'lineyinner ' : ''}
                    style={lineystyle}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div>
          {queryModel.tables[tableName].qFields.map((field) => {
            const isFilterboxOpen = openBoxes[field.qName];
            if (field.qKeyType === 'NOT_KEY') {
              let classes = 'vertcell';
              if (atPlayModel.keysAtPlay[field.qName]) {
                classes += ' keyAtPlay';
              } else if (assocationsHighlighted) {
                classes += ' notKeyAtPlay';
              }

              const cellContainerStyle = {};
              if (isFilterboxOpen) {
                cellContainerStyle.height = '30em';
              }

              return (
                <div
                  className={classes}
                  fieldz={field.qName}
                  key={field.qName}
                  style={cellContainerStyle}
                >
                  <Field app={app} field={field.qName} fieldData={field} showFilterbox={isFilterboxOpen} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  });

  return (
    <ScrollArea className="scrollArea" height="100%" width="100%">
      <div className="model">
        <div
          className="colset"
          onClick={toggleField}
          role="tablist"
          tabIndex={-1}
        >
          {gridz}
        </div>
      </div>
    </ScrollArea>
  );
}

Model.propTypes = {
  app: PropTypes.object.isRequired,
  appLayout: PropTypes.object.isRequired,
};
