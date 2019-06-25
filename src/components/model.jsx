import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import usePromise from 'react-use-promise';
import ReactFloater from 'react-floater';
import Resizable from 're-resizable';

import ScrollArea from './scroll-area';
import TableField from './table-field';
import Loading from './loading';
import CatWithBubble from './cat-with-bubble';
import logic from '../logic/logic';
import atplay from '../logic/atplay';
import demoApp from '../demo-app';

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

export default function Model({ app, appLayout, isLocalStorage }) {
  if (!appLayout) {
    return (
      <Loading />
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
    let headerClasses = 'vertcell tableheader';
    if (atPlayModel.tablesAtPlay[tableName]) {
      columnClasses += ' tableAtPlay';
    } else if (assocationsHighlighted) {
      columnClasses += ' notTableAtPlay';
    }
    if (odd) {
      columnClasses += ' odd';
      headerClasses += ' odd';
    }
    odd = !odd;

    const saveTableWidth = (ref, name) => {
      if (isLocalStorage) {
        const key = `${app.id}/tables/${name}`;

        localStorage.setItem(key, ref.offsetWidth);
      }
    };

    const key = `${app.id}/tables/${tableName}`;
    const minTableWidth = 29 * 8;
    const savedTableWidth = (isLocalStorage && localStorage.getItem(key));
    const tableSize = savedTableWidth ? { width: `${savedTableWidth}px` } : 'auto';
    const handleStyle = {
      right: {
        zIndex: 3,
        width: '3.5em',
      },
    };

    return (
      <Resizable
        key={tableName}
        defaultSize={tableSize}
        minWidth={minTableWidth}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        onResizeStart={e => e.stopPropagation()}
        onResizeStop={(e, dir, ref) => saveTableWidth(ref, tableName)}
        handleStyles={handleStyle}
      >
        <div>
          <div
            className={headerClasses}
            data-tableheader={tableName}
            title={getTableTooltip(queryModel.tables[tableName])}
            style={{
              margin: 0, zIndex: 3, position: 'sticky', top: 0,
            }}
          >
            <div>{tableName}</div>
            <div className="nbr-of-rows">{queryModel.tables[tableName].qNoOfRows}</div>
          </div>
          <div className={columnClasses} role="tab" tablez={tableName}>
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
        </div>
      </Resizable>
    );
  });

  const speechBubbleClick = () => {
    if (window.location) {
      const URLobject = new URL(window.location.href);
      window.location.assign(`${URLobject.protocol}//${window.location.host}?engine_url=`);
    }
  };
  const catWithBubble = demoApp.includes(appLayout.qFileName)
    ? (
      <CatWithBubble
        text="Note that this is a demo app. If you want to connect to your own engine
        running your own apps, click my speech bubble, and enter the websocket URL."
        onClick={speechBubbleClick}
      />
    ) : null;
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
            {catWithBubble}
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
  isLocalStorage: false,
};

Model.propTypes = {
  app: PropTypes.object,
  appLayout: PropTypes.object,
  isLocalStorage: PropTypes.bool,
};
