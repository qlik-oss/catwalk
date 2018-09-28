import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import OutsideClickHandler from 'react-outside-click-handler';

import logic from '../logic/logic';
import atplay from '../logic/atplay';

import './model2.scss';
import Field2 from './field2';
import Filterbox from './filterbox';


function renderFilterbox(app, field, alignTo) {
  const item = alignTo;
  // while (item.parentNode && item.nodeName !== 'LI') {
  //   item = item.parentNode;
  // }
  item.classList.add('selected');
  ReactDOM.render(
    <OutsideClickHandler
      onOutsideClick={() => ReactDOM.unmountComponentAtNode(document.querySelector('#overlays'))}
    >
      <Filterbox
        app={app}
        field={field}
        alignTo={item}
        onClose={() => item.classList.remove('selected')}
      />
    </OutsideClickHandler>,
    document.querySelector('#overlays'),
  );
}


function colorOfField(field) {
  switch (field.qKeyType) {
    case 'PERFECT_KEY': return '#c4d700';
    case 'PRIMARY_KEY': return '#ffc626';
    default: return '#f87f8c';
  }
}

export default class Model extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { app } = this.props;
    app.getTablesAndKeys({}, {}, 0, true, false)
      .then((tablesAndKeys) => {
        const openListboxes = {};
        const model = new logic.QueryModel(tablesAndKeys);
        const atPlayModel = new atplay.AtPlayModel(model, openListboxes);
        this.setState({
          tablesAndKeys, model, atPlayModel, openListboxes,
        });
      });
  }

  onClick(event) {
    const field = this.findAttribute(event, 'fieldz');
    const table = this.findAttribute(event, 'tablez');
    const { openListboxes } = this.state;
    if (field) {
      if (openListboxes[field]) {
        delete openListboxes[field];
      } else {
        openListboxes[field] = true;
      }
      this.state.atPlayModel = new atplay.AtPlayModel(this.state.model, openListboxes);
      this.setState(this.state);
    } else if (table) {
      const { tablesAndKeys } = this.state;
      this.state.atPlayModel = new atplay.AtPlayModel(this.state.model, openListboxes);
      this.setState({ model: new logic.QueryModel(tablesAndKeys, table) });
    }
  }

  findAttribute(event, attrName) {
    let el = event.target;
    while (!!el && !el.getAttribute(attrName)) {
      el = el.parentElement;
    }

    const field = el && el.getAttribute(attrName);
    return field;
  }

  render() {
    if (!this.state) {
      return null;
    }

    const { app } = this.props;
    const { openListboxes, model, atPlayModel } = this.state;


    const assocationsHighlighted = Object.keys(openListboxes).length > 1;
    //
    // const fields = {};
    // const tables = {};
    //

    //
    // tablesAndKeys.qtr.forEach((table) => {
    //   tables[table.qName] = table;
    //   table.qFields.forEach((field) => {
    //     fields[field.qName] = fields[field.qName] || field;
    //     grid[field.qName] = grid[field.qName] || {};
    //     grid[field.qName][table.qName] = field;
    //   });
    // });
    //
    // const tableArray = model.resultTableList;
    // const fieldArray = model.resultFieldList;
    // const grid = model.grid;

    // const headerRow = model.resultTableList.map(tableName => (
    //   <th>
    //     <div>{tableName}</div>
    //     <div>{model.tables[tableName].qNoOfRows}</div>
    //   </th>
    // ));
    //
    // const htmlTableContent = model.resultFieldList.map(fieldName => (
    //   <tr className="table-row">
    //     <td className={`table-field-${model.fields[fieldName].qKeyType}`}>
    //       {fieldName}
    //     </td>
    //     {
    //       model.resultTableList.map((tableName) => {
    //         const x = model.grid[fieldName][tableName];
    //         if (x && !x.isEmpty) {
    //           const classes = `table-cell table-cell-${x.qKeyType}`;
    //           return (
    //             <td onClick={evt => renderFilterbox(app, fieldName, evt.target)}>
    //               <Field2 app={app} field={fieldName} fieldData={x}/>
    //             </td>
    //           );
    //         }
    //         return (
    //           <td>
    //             <div className="betweener">
    //               <div className={!x.outsideKeyX ? 'linex ' : ''}/>
    //               <div className={!x.outsideKeyY ? 'liney ' : ''}/>
    //             </div>
    //           </td>
    //         );
    //       })
    //     }
    //   </tr>
    // ));


    const gridz = model.resultTableList.map((tableName) => {
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
            <div>{model.tables[tableName].qNoOfRows}</div>
          </div>
          <div>
            {
            model.resultFieldList.map((fieldName) => {
              const x = model.grid[fieldName][tableName];
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
                return (
                  <div className={classes} key={`${tableName}:${fieldName}`} fieldz={fieldName}>
                    <Field2 app={app} field={fieldName} fieldData={x} />
                    { x.hasAssociationToLeft ? (
                      <div className="association-to-left" style={assocStyle}>
                        <div className="association-to-left-a" />
                        <div className="association-to-left-b" />
                        <div className="association-to-left-c" />
                      </div>) : null}
                    { x.hasAssociationToRight ? (
                      <div className="association-to-right" style={assocStyle}>
                        <div className="association-to-right-a" />
                        <div className="association-to-right-b" />
                        <div className="association-to-right-c" />
                      </div>) : null}
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
                <div className="vertcell" key={`${tableName}:${fieldName}`}>
                  <div className={classes}>
                    <div className={(x.betweenKeys && !x.isKey) ? 'lineyinner ' : ''} style={lineystyle} />
                  </div>
                </div>
              );
            })
          }
          </div>
          <div>
            {
            model.tables[tableName].qFields.map((field) => {
              if (field.qKeyType === 'NOT_KEY') {
                let classes = 'vertcell';
                if (atPlayModel.keysAtPlay[field.qName]) {
                  classes += ' keyAtPlay';
                } else if (assocationsHighlighted) {
                  classes += ' notKeyAtPlay';
                }

                return (
                  <div className={classes} fieldz={field.qName} key={field.qName}>
                    <Field2 app={app} field={field.qName} fieldData={field} />
                  </div>
                );
              }
              return null;
            })
          }
          </div>
        </div>);
    });

    return (
      <div className="model2">
        <div className="colset" onClick={evt => this.onClick(evt)}>
          {gridz}
        </div>

        <div className="listboxcolset" onClick={evt => this.onClick(evt)}>
          {
            Object.keys(openListboxes).map(fieldName => (
              <div className="listboxcolumn" key={fieldName}>
                <span>{fieldName}</span>
                <span className="closer" fieldz={fieldName}>[close]</span>
                <Filterbox app={app} field={fieldName} />
              </div>))
          }
        </div>
      </div>
    );
    // const tablez = tablesAndKeys.qtr
    //   .sort((a, b) => b.qFields.length - a.qFields.length)
    //   .map(t => (
    //     <div key={t.qName} className="item">
    //       <Table app={app} table={t} />
    //     </div>
    //   ));
    // const relations = tablesAndKeys.qk
    //   .map(r => (<Relation key={r.qKeyFields.join('-')} relation={r} />));
    // return (
    //   <div className="model">
    //     <div className="relations">
    //       {relations}
    //     </div>
    //     <div className="tables">
    //       {tablez}
    //     </div>
    //   </div>
    // );
  }
}

Model.propTypes = {
  app: PropTypes.object.isRequired,
};
