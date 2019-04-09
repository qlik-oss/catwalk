import React from 'react';
/* eslint-disable react/jsx-one-expression-per-line */

function getComment(item) {
  return item.qComment ? `\n\n${item.qComment}` : '';
}

export function getTooltipForSubsetRatio(field) {
  if (!!field.qnPresentDistinctValues && !!field.qnTotalDistinctValues && field.qnPresentDistinctValues < field.qnTotalDistinctValues) {
    return (
      <div className="tooltip">
        <h2>
          {`${field.subsetRatioText} subset ratio`}
        </h2>
        <p>
          <b>{field.qnPresentDistinctValues}</b>
          {' out of '}
          <b>{field.qnTotalDistinctValues}</b>
          {' '}
          <i>{field.qName}</i>
          {' values are present in the '}
          <i>{field.srcTable.qName}</i>
          {' table. '}
        </p>
        <p>
          {'The remaining '}
          {field.qnTotalDistinctValues - field.qnPresentDistinctValues}
          {' values only exist in other tables ('}
          <i>{field.otherTables.join(', ')}</i>
          {').'}
        </p>
        <p>
          {'This means that there are '}
          <i>rows in associated tables that do not have any matching rows in this table.</i>
        </p>
        <p>Note that when interacting with a field - all values are shown - not only the ones that are present in the underlying table.</p>
      </div>
    );
  }
  return <div />;
}

export function getExtraInfoForField(fieldData) {
  const { layout } = fieldData;
  if (!layout) {
    return null;
  }

  const nullCount = fieldData.qnRows - fieldData.qnNonNulls;
  const rowWithValueCount = fieldData.qnNonNulls;
  const uniqueValueCount = fieldData.qnPresentDistinctValues;
  const allNonNullValuesAreUnique = (fieldData.qnPresentDistinctValues === fieldData.qnNonNulls);
  const avgDup = rowWithValueCount > uniqueValueCount ? `~ ${(rowWithValueCount / uniqueValueCount).toFixed(3)}` : '1';

  function keyDescription() {
    switch (fieldData.qKeyType) {
      case 'PERFECT_KEY':
        return (
          <React.Fragment>
            <div className="headerContainer">
              <h3 className="perfect-key">Perfect key</h3>
            </div>
            <span>Each row in the  <i>{fieldData.srcTable.qName}</i> table is uniquely identified by its <i>{fieldData.qName}</i> value.</span>
            <p>All <i>{fieldData.qName}</i> values in the entire data model are present in the <i>{fieldData.srcTable.qName}</i> table.</p>
          </React.Fragment>
        );
      case 'PRIMARY_KEY':
        return (
          <React.Fragment>
            <div className="headerContainer">
              <h3 className="primary-key">Primary key</h3>
            </div>
            <span>Each row in the  <i>{fieldData.srcTable.qName}</i> table is uniquely identified by its <i>{fieldData.qName}</i> value.</span>
          </React.Fragment>
        );
      case 'ANY_KEY':
        if (allNonNullValuesAreUnique) {
          return (
            <React.Fragment>
              <div className="headerContainer">
                <h3 className="foreign-key">Foreign key</h3><h3> - Contains null rows</h3>
              </div>
              <p>All present values are unique but there are {nullCount} rows with nulls.</p>
              <p>A single <i>{fieldData.qName} </i> value identifies at most one row in the <i>{fieldData.srcTable.qName}</i> table.</p>
            </React.Fragment>
          );
        }
        if (fieldData.qHasNull) {
          return (
            <React.Fragment>
              <div className="headerContainer">
                <h3 className="foreign-key">Foreign Key</h3><h3> - Many rows per value + null rows</h3>
              </div>
              <p>Values are repeated on several rows plus there are {nullCount} rows with nulls.</p>
              <p>A single <i>{fieldData.qName} </i> value may identify several rows in the <i>{fieldData.srcTable.qName}</i> table.</p>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <div className="headerContainer">
              <h3 className="foreign-key">Foreign key</h3><h3> - Many rows per value</h3>
            </div>
            <p>Values are repeated on several rows. All rows have values.</p>
            <p>A single <i>{fieldData.qName} </i> value may identify several rows in the <i>{fieldData.srcTable.qName}</i> table.</p>
            {/* <span>Average row count per value is {avgDup} times. No nulls.</span> */}
          </React.Fragment>
        );
      default:
        return null;
    }
  }

  return (
    <div className="tooltip">
      <div>
        <h2>Field {fieldData.qName} <br /> in table {fieldData.srcTable.qName}</h2>
        <p>{getComment(fieldData)}</p>
        <table>
          <tbody>
            <tr />
            <tr>
              <th>Total Rows</th>
              <td>{fieldData.qnRows}</td>
            </tr>
            <tr>
              <th>Rows with value</th>
              <td>{fieldData.qnNonNulls}</td>
            </tr>
            <tr>
              <th>Rows with null</th>
              <td>{nullCount}</td>
            </tr>
            {(fieldData.qnTotalDistinctValues > fieldData.qnPresentDistinctValues)
              ? (
                <React.Fragment>
                  <tr>
                    <th>Unique values (in this table)</th>
                    <td>{fieldData.qnPresentDistinctValues}</td>
                  </tr>
                  <tr>
                    <th>Unique values (in all tables)</th>
                    <td>{fieldData.qnTotalDistinctValues}</td>
                  </tr>
                </React.Fragment>
              )
              : (
                <tr>
                  <th>Unique values</th>
                  <td>{fieldData.qnPresentDistinctValues}</td>
                </tr>
              )
            }
            <tr>
              <th>Rows per unique value</th>
              <td>{avgDup}</td>
            </tr>
          </tbody>
        </table>
        {keyDescription()}
        {getTooltipForSubsetRatio(fieldData)}
      </div>
      <div />
    </div>
  );
}


function reduceWithAnd(items, maxItems) {
  let result = '';
  if (items.length > maxItems) {
    for (let i = 0; i < maxItems; i += 1) {
      result += `${items[i]}, `;
    }
    result += '...';
  } else {
    for (let i = 0; i < items.length - 1; i += 1) {
      result += `${items[i]}, `;
    }
    result = `${result} and ${items[items.length - 1]}`;
  }
  return result;
}

export function getTooltipForSyntheticField(fieldData) {
  if (fieldData.qOriginalFields.length > 0) {
    return `Synthetic field\n\nReplaces the fields ${reduceWithAnd(fieldData.qOriginalFields)} with one association field since tables cannot be associated with multiple fields. The original fields have been moved to a synthetic link table.`;
  }
  if (fieldData.srcTable.qIsSynthetic) {
    return 'Synthetic field\n\nLinks the generated association field to the original field values that have been moved into this synthetic link table';
  }
  return 'Synthetic field';
}


function firstFewValues(layout) {
  const rowToText = row => `${row[0].qText || '<empty>'}`;

  const selected = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'S' || row[0].qState === 'O');
  const excluded = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'X');

  let result = '';
  if (selected.length > 0) {
    result += `Example values:\n${selected.map(rowToText).join(', ')}\n`;
  }
  if (excluded.length > 0) {
    result += `\nExample of excluded values:\n${excluded.map(rowToText).join(', ')}`;
  }

  return result;
}

export function getTooltipForField(fieldData, layout) {
  let descriptions = '';

  if (fieldData.qHasDuplicates) {
    descriptions += 'Duplicate values';
  } else {
    descriptions += 'Unique values';
  }

  if (fieldData.qHasNull) {
    descriptions += ', has nulls';
  } else {
    descriptions += ', no nulls.';
  }
  return `Field ${fieldData.qName}${getComment(fieldData)}\n\n${fieldData.qnTotalDistinctValues} unique values (of which only ${fieldData.qnPresentDistinctValues} are present in the ${fieldData.srcTable.qName} table).\n\n${descriptions}\n\n${firstFewValues(layout)}`;
}

export function getSelectionBarTooltip(fieldData, layout) {
  const total = layout.qListObject.qDimensionInfo.qCardinal;
  const states = layout.qListObject.qDimensionInfo.qStateCounts;

  let subsetRatioInfo = '';
  if (fieldData.qnPresentDistinctValues < fieldData.qnTotalDistinctValues) {
    subsetRatioInfo = `(of which only ${fieldData.qnPresentDistinctValues} are present in the ${fieldData.srcTable.qName} table)`;
  }

  return `${states.qSelected} selected, ${states.qOption
  + states.qAlternative} possible, ${
    states.qExcluded} excluded, ${total} values in total ${subsetRatioInfo}.`;
}

export function getAssosicationTooltip(fieldName) {
  return `Association between tables that share the field ${fieldName}. An association allows a selection in one table to infer what field values are possible in the associated table(s).`;
}

export function getTableTooltip(table) {
  return `Table ${table.qName}${getComment(table)}\n\nRow count: ${table.qNoOfRows}\n\nFields: ${reduceWithAnd(table.qFields.map(item => item.qName), 5)}`;
}
