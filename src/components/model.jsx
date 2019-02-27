import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import usePromise from 'react-use-promise';
import ReactFloater from 'react-floater';
import SVGInline from 'react-svg-inline';

import ScrollArea from './scroll-area';
import TableField from './table-field';
import logic from '../logic/logic';
import atplay from '../logic/atplay';
import catwalkAway from '../assets/catwalk-away.svg';

import { getExtraInfoForField, getAssosicationTooltip, getTableTooltip } from './tooltip';

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
  const [tablesAndKeys] = usePromise(() => app.getTablesAndKeys({}, {}, 0, true, false), [appLayout.qLastReloadTime]);
  return tablesAndKeys;
}

export default function Model({ app, appLayout }) {
  if (!appLayout) {
    return (
      <div className="center-content">
        <SVGInline className="loading" svg={catwalkAway} />
      </div>
    );
  }
  const tablesAndKeys = useTablesAndKeys(app, appLayout);
  const [openBoxes, setOpenBoxes] = useState({});
  const [queryModel, setQueryModel] = useState(null);
  const [atPlayModel, setAtPlayModel] = useState(null);
  const [currentDetailsView, setCurrentDetailsView] = useState(null); // The currently open extra info dialog

  let boxIdCounter = 0;

  function getExtraInfoForTableField(tableName, fieldName) {
    const field = queryModel.getTableField(tableName, fieldName);
    return getExtraInfoForField(field);
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


  function showFieldDetails(table, field, boxId) {
    // toggle the detailsView - if already open in this box, close.
    if (currentDetailsView && boxId === currentDetailsView.boxId) {
      setCurrentDetailsView(null);
    } else {
      setCurrentDetailsView({ boxId, content: getExtraInfoForTableField(table, field) });
    }
  }
  const onClick = (evt) => {
    if (evt.ctrlKey || evt.metaKey) {
      return;
    }

    // The following attribute is set if the extra-info icon is clicked
    const extraInfoIcon = findAttribute(evt, 'data-extra-info-icon');

    // The following attribute indicates what div to align the extra info popup with
    const boxId = findAttribute(evt, 'data-boxid');

    // The following attribute is set if the table header is clicked
    const dataTableHeader = findAttribute(evt, 'data-tableheader');

    // The field the click is on
    const field = findAttribute(evt, 'fieldz');

    // The table the click is on
    const table = findAttribute(evt, 'tablez');

    // Depending on where the click was do different things:
    if (extraInfoIcon) {
      // Show field details
      showFieldDetails(table, field, boxId);
    } else if (dataTableHeader) {
      // Re-sort the main data model based on the clicked table
      const newQueryModel = new logic.QueryModel(tablesAndKeys, table);
      setQueryModel(newQueryModel);
    } else if (field) {
      // Open or close a field
      // If synthetic, do nothing.
      const fieldData = queryModel.grid[field][table];
      const isSynthetic = (fieldData.qTags && fieldData.qTags.find(item => item === '$synthetic'));
      if (isSynthetic) return;
      if (openBoxes[field]) {
        delete openBoxes[field];
      } else {
        openBoxes[field] = true;
      }
      const newAtPlayModel = new atplay.AtPlayModel(queryModel, openBoxes);
      setAtPlayModel(newAtPlayModel);
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

  const extraInfoContainer = currentDetailsView ? (
    <div className="floatercontainer" key={currentDetailsView.boxId}>
      <ReactFloater
        autoOpen
        disableAnimation
        showCloseButton
        placement="right"
        target={`[data-boxid="${currentDetailsView.boxId}"]`}
        content={currentDetailsView.content}
        callback={(event) => { if (event === 'close') { setCurrentDetailsView(null); } }}
      />
    </div>
  ) : null;

  let odd = false;
  const assocationsHighlighted = Object.keys(openBoxes).length > 1;
  const gridz = queryModel.resultTableList.map((tableName) => {
    let columnClasses = 'column';
    if (atPlayModel.tablesAtPlay[tableName]) {
      columnClasses += ' tableAtPlay';
    } else if (assocationsHighlighted) {
      columnClasses += ' notTableAtPlay';
    }
    if (odd) {
      columnClasses += ' odd';
    }
    odd = !odd;

    return (
      <div className={columnClasses} key={tableName} role="tab" tablez={tableName}>
        <div className="vertcell tableheader" data-tableheader={tableName} title={getTableTooltip(queryModel.tables[tableName])}>
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

              boxIdCounter += 1;
              const currentboxid = boxIdCounter;
              return (
                <div
                  data-boxid={`${currentboxid}`}
                  className={classes}
                  style={cellContainerStyle}
                  key={`${tableName}:${fieldName}`}
                  fieldz={fieldName}
                  role="tab"
                >
                  <TableField app={app} field={fieldName} fieldData={x} tableData={queryModel.tables[tableName]} showFilterbox={isFilterboxOpen} />

                  {x.subsetRatioText ? (
                    <div className="subsetratio" title={x.subsetRatioTitle}>{x.subsetRatioText}</div>
                  ) : null}
                  {x.hasAssociationToLeft ? (
                    <div className="association-to-left" style={assocStyle} title={getAssosicationTooltip(fieldName)}>
                      <div className="association-to-left-a" />
                      <div className="association-to-left-b" style={leftAssocStyle} />
                      <div className="association-to-left-c" />
                      <div className="association-to-left-d">{x.assocSymbol}</div>
                    </div>
                  ) : null}
                  {x.hasAssociationToRight ? (
                    <div className="association-to-right" style={assocStyle} title={getAssosicationTooltip(fieldName)}>
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
              <div className="vertcell" key={`${tableName}:${fieldName}`} style={cellContainerStyle} title={x.betweenKeys ? getAssosicationTooltip(fieldName) : ''}>
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

              boxIdCounter += 1;
              const currentboxid = boxIdCounter;
              return (
                <div
                  data-boxid={`${currentboxid}`}
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
            onClick={onClick}
            role="tablist"
            tabIndex={-1}
          >
            {gridz}
          </div>
        </div>
      </ScrollArea>
      {extraInfoContainer}
    </React.Fragment>
  );
}

Model.defaultProps = {
  app: null,
  appLayout: null,
};

Model.propTypes = {
  app: PropTypes.object,
  appLayout: PropTypes.object,
};
