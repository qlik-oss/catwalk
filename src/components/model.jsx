import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import usePromise from 'react-use-promise';
import ReactTooltip from 'react-tooltip';
import ScrollArea from './scroll-area';
import TableField from './table-field';
import logic from '../logic/logic';
import atplay from '../logic/atplay';

import { getTooltipForField, getTooltipForSubsetRatio} from './tooltip';

import './model.pcss';
import './tooltip.pcss';


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


  function getTooltipForSubsetRatioContent(datatip) {
    if (!datatip) {
      return null;
    }
    const { tableName, fieldName } = JSON.parse(datatip);
    const field = queryModel.getTableField(tableName, fieldName);
    return getTooltipForSubsetRatio(field);
  }

  function getTooltipForTableFieldContent(datatip) {
    if (!datatip) {
      return null;
    }
    const { tableName, fieldName } = JSON.parse(datatip);
    const field = queryModel.getTableField(tableName, fieldName);
    return getTooltipForField(field);
  }

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
    if (evt.ctrlKey || evt.metaKey) {
      return;
    }
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

  if (!tablesAndKeys.qk.length && !tablesAndKeys.qtr.length) {
    return (
      <div className="center-content model no-data">
        It looks like there is no data loaded in this app yet.
      </div>
    );
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
      <div className={columnClasses} key={tableName} role="tab">
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
              const tooltipData = JSON.stringify({ tableName: x.srcTable.qName, fieldName: x.qName });

              return (
                <div
                  data-tip={tooltipData}
                  data-for="table-field-tooltip"
                  className={classes}
                  style={cellContainerStyle}
                  key={`${tableName}:${fieldName}`}
                  fieldz={fieldName}
                  role="tab"
                >
                  <TableField app={app} field={fieldName} fieldData={x} tableData={queryModel.tables[tableName]} showFilterbox={isFilterboxOpen} />

                  {x.subsetRatioText ? (
                    <React.Fragment>
                      <div className="subsetratio" data-tip={tooltipData} data-for="subsetratio-tooltip">{x.subsetRatioText}</div>
                    </React.Fragment>
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
          {queryModel.tables[tableName].qFields.map((fieldData) => {
            const isFilterboxOpen = openBoxes[fieldData.qName];
            if (fieldData.qKeyType === 'NOT_KEY') {
              let classes = 'vertcell';
              if (atPlayModel.keysAtPlay[fieldData.qName]) {
                classes += ' keyAtPlay';
              } else if (assocationsHighlighted) {
                classes += ' notKeyAtPlay';
              }

              const cellContainerStyle = {};
              if (isFilterboxOpen) {
                cellContainerStyle.height = '30em';
              }

              const tooltipData = JSON.stringify({ tableName: fieldData.srcTable.qName, fieldName: fieldData.qName });

              return (
                <div
                  data-tip={tooltipData}
                  data-for="table-field-tooltip"
                  className={classes}
                  fieldz={fieldData.qName}
                  key={fieldData.qName}
                  style={cellContainerStyle}
                >
                  <TableField app={app} field={fieldData.qName} fieldData={fieldData} showFilterbox={isFilterboxOpen} />
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
    <React.Fragment>
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
      <ReactTooltip id="subsetratio-tooltip" delayShow={500} effect="float" type="custom" className="tooltip" getContent={dataTip => getTooltipForSubsetRatioContent(dataTip)} />
      <ReactTooltip id="table-field-tooltip" delayShow={500} effect="float" type="custom" className="tooltip" getContent={dataTip => getTooltipForTableFieldContent(dataTip)} />
    </React.Fragment>
  );
}

Model.propTypes = {
  app: PropTypes.object.isRequired,
  appLayout: PropTypes.object.isRequired,
};
