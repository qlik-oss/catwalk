import React from 'react';
/* eslint-disable react/jsx-one-expression-per-line */

function limitLength(text) {
  if (text && text.length > 40) {
    return `${text.substring(0, 37)}...`;
  }
  return text;
}

export function getTooltipForSubsetRatio(field) {
  if (!!field.qnPresentDistinctValues && !!field.qnTotalDistinctValues && field.qnPresentDistinctValues < field.qnTotalDistinctValues) {
    return (
      <div>
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
          <i>{field.otherTables.join('')}</i>
          {').'}
        </p>
        <p>
          {'This means that there are '}
          <i>rows in associated tables that do not have any matching rows in this table.</i>
        </p>
      </div>
    );
  }
  return <div />;
}

export function getTooltipForField(fieldData) {
  const { layout } = fieldData;
  if (!layout) {
    return null;
  }

  function examples() {
    const includedRows = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'S' || row[0].qState === 'O');
    const excludedRows = layout.qListObject.qDataPages[0].qMatrix.filter(row => row[0].qState === 'X');
    const rowToText = row => <div className="example-item" key={row[0].qElemNumber}>{limitLength(row[0].qText) || '<empty>'}</div>;
    const rowToText2 = row => limitLength(row[0].qText) || '<empty>';
    let included = null;
    let excluded = null;

    if (includedRows.length > 0) {
      const title = fieldData.isKey ? `Example values (from ${fieldData.tables.join(' + ')})` : 'Example values';
      included = (
        <React.Fragment>
          <h3>{title}</h3>
          {includedRows.map(rowToText2).reduce((a, b) => `${a}, ${b}`)}
        </React.Fragment>
      );
    }
    if (excludedRows.length > 0) {
      const title = fieldData.isKey ? `Example of excluded values (from ${fieldData.tables.join(' + ')})` : 'Example values';
      excluded = (
        <React.Fragment>
          <h3>{title}</h3>
          {includedRows.map(rowToText2).reduce((a, b) => `${a}, ${b}`)}
        </React.Fragment>
      );
    }

    return (
      <react-fragment>
        {included}
        {excluded}
      </react-fragment>
    );
  }

  const total = layout.qListObject.qDimensionInfo.qCardinal;
  const states = layout.qListObject.qDimensionInfo.qStateCounts;

  const nullCount = fieldData.qnRows - fieldData.qnNonNulls;
  const rowWithValueCount = fieldData.qnNonNulls;
  const uniqueValueCount = fieldData.qnPresentDistinctValues;
  const allNonNullValuesAreUnique = (fieldData.qnPresentDistinctValues === fieldData.qnNonNulls);
  const avgDup = rowWithValueCount > uniqueValueCount ? `~ ${(rowWithValueCount / uniqueValueCount).toFixed(3)}` : '1';

  // const subsetRatioSection = fieldData.qSubsetRatio < 1
  //   ? (
  //     <React.Fragment>
  //       <h3>{fieldData.subsetRatioText} subset ratio</h3>
  //       <p>{fieldData.subsetRatioTitle}</p>
  //     </React.Fragment>
  //   )
  //   : null;

  function keyDescription() {
    switch (fieldData.qKeyType) {
      case 'PERFECT_KEY':
        return (
          <React.Fragment>
            <h3>Perfect key</h3>
            <span>Each row in the  <i>{fieldData.srcTable.qName}</i> table is uniquely identified by its <i>{fieldData.qName}</i> value.</span>
            <p>All <i>{fieldData.qName}</i> values in the entire data model are present in the <i>{fieldData.srcTable.qName}</i> table.</p>
          </React.Fragment>
        );
      case 'PRIMARY_KEY':
        return (
          <React.Fragment>
            <h3>Primary key</h3>
            <span>Each row in the  <i>{fieldData.srcTable.qName}</i> table is uniquely identified by its <i>{fieldData.qName}</i> value.</span>
          </React.Fragment>
        );
      case 'ANY_KEY':
        if (allNonNullValuesAreUnique) {
          return (
            <React.Fragment>
              <h3>Foreign key - Contains null rows</h3>
              <span>All present values are unique but there are {nullCount} rows with nulls.</span>
            </React.Fragment>
          );
        }
        if (fieldData.qHasNull) {
          return (
            <React.Fragment>
              <h3>Foreign Key - Many rows per value + null rows</h3>
              <span>Average row count per value is {avgDup} times. Plus {nullCount} rows with nulls.</span>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <h3>Foreign key - Many rows per value</h3>
            <span>Average row count per value is {avgDup} times. No nulls.</span>
          </React.Fragment>
        );
      default:
        return null;
        // if (allNonNullValuesAreUnique) {
        //   return (
        //     <React.Fragment>
        //       <h3>Unique values plus {fieldData.qnRows - fieldData.qnNonNulls} nulls</h3>
        //       <span>All present values are unique but there are {nullCount} rows with nulls.</span>
        //     </React.Fragment>
        //   );
        // }
        // if (fieldData.qHasNull) {
        //   return (
        //     <React.Fragment>
        //       <h3>Repeated values + {fieldData.qnRows - fieldData.qnNonNulls} nulls</h3>
        //       <span>Average row count per value is {avgDup} times. Plus {nullCount} rows with nulls.</span>
        //     </React.Fragment>
        //   );
        // }
        // return (
        //   <React.Fragment>
        //     <h3>Repeated values</h3>
        //     <span>Average row count per value is {avgDup} times. No nulls.</span>
        //   </React.Fragment>
        // );
    }
  }

  function nullDescription() {
    if (fieldData.qHasNull) {
      return <div className="property">Contains <b>{fieldData.qnRows - fieldData.qnNonNulls} </b> nulls</div>;
    }
    return <div className="property">All rows have values</div>;
  }


  // const title = `${fieldData.qName} \n\n${states.qSelected} selected, ${states.qOption
  // + states.qAlternative} possible, ${
  //   states.qExcluded} excluded, total of ${total} values. ${descriptions}\n\n${firstFewValues(layout)}`;

  function selections() {
    return (
      <span>
        {states.qSelected} selected, {states.qOption + states.qAlternative} possible, {states.qExcluded} excluded, total of ${total} values.
      </span>
    );
  }


  return (
    <div>
      <div>
        <h2>Field {fieldData.qName} <br /> in table {fieldData.srcTable.qName}</h2>
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
            <tr>
              <th>Unique values</th>
              <td>{fieldData.qnPresentDistinctValues}</td>
            </tr>
            <tr>
              <th>Rows per unique value</th>
              <td>{avgDup}</td>
            </tr>
          </tbody>
        </table>
        {keyDescription()}
        {getTooltipForSubsetRatio(fieldData)}
        {examples(layout)}
      </div>
      <div />
    </div>
  );
}

export function getTooltipForSyntheticField(fieldData) {
  return <div>Synthetic field</div>;
}
