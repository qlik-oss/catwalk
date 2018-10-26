import React from 'react';
import PropTypes from 'prop-types';

import ScrollArea from './scroll-area';
import logic from '../logic/logic';
import atplay from '../logic/atplay';

import './model.scss';
import Field from './field';
import withApp from './with-app';
import withModel from './with-model';

function findAttribute(event, attrName) {
  let el = event.target;
  while (!!el && !el.getAttribute(attrName)) {
    el = el.parentElement;
  }

  const field = el && el.getAttribute(attrName);
  return field;
}

export class Model extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    this.updatePlay();
  }

  componentDidUpdate(prevProps) {
    const { model } = this.props;
    if (model !== prevProps.model) {
      this.updatePlay();
    }
  }

  onClick(event) {
    const { queryModel, openListboxes } = this.state;
    const field = findAttribute(event, 'fieldz');
    const table = findAttribute(event, 'tablez');
    if (field) {
      if (openListboxes[field]) {
        delete openListboxes[field];
      } else {
        openListboxes[field] = true;
      }
      const atPlayModel = new atplay.AtPlayModel(queryModel, openListboxes);
      this.setState({ atPlayModel, openListboxes, queryModel });
    } else if (table) {
      const { model } = this.props;
      const newModel = new logic.QueryModel(model, table);
      this.setState({ queryModel: newModel });
    }
  }

  updatePlay() {
    const { model } = this.props;
    let openBoxes;
    if (!this.state) {
      openBoxes = {};
    } else {
      const { openListboxes } = this.state;
      openBoxes = openListboxes;
    }
    const queryModel = new logic.QueryModel(model);
    const atPlayModel = new atplay.AtPlayModel(queryModel, openBoxes);
    this.setState({
      queryModel,
      atPlayModel,
      openListboxes: openBoxes,
    });
  }

  render() {
    if (!this.state) {
      return null;
    }
    const { openListboxes, queryModel, atPlayModel } = this.state;

    const assocationsHighlighted = Object.keys(openListboxes).length > 1;

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
              const isFilterboxOpen = openListboxes[fieldName];
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
                    <Field field={fieldName} fieldData={x} showFilterbox={isFilterboxOpen} />
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
              const isFilterboxOpen = openListboxes[field.qName];
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
                    <Field field={field.qName} fieldData={field} showFilterbox={isFilterboxOpen} />
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
            onClick={evt => this.onClick(evt)}
            role="tablist"
            tabIndex={-1}
          >
            {gridz}
          </div>
        </div>
      </ScrollArea>
    );
  }
}

Model.propTypes = {
  model: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  lastReloadTime: PropTypes.string,
};

Model.defaultProps = {
  model: null,
  lastReloadTime: '',
};

export default withApp(withModel({ WrappedComponent: Model, createModel: async app => app.getTablesAndKeys({}, {}, 0, true, false), updateOnAppInvalidation: true }));
