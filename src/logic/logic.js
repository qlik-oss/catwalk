// Kudos to https://gist.github.com/jedfoster/7939513 for this
// functionality
function mixColors(color1, color2, weight) {
  function dec2hex(d) { return d.toString(16); }

  function hext2dec(h) { return parseInt(h, 16); }

  let color = '#';
  for (let i = 1; i <= 6; i += 2) {
    const v1 = hext2dec(color1.substr(i, 2));
    const v2 = hext2dec(color2.substr(i, 2));
    let val = dec2hex(Math.floor(v2 + (v1 - v2) * weight));
    while (val.length < 2) { val = `0${val}`; }
    color += val;
  }

  return color; // PROFIT!
}

function colorOfField(field) {
  switch (field.qKeyType) {
    case 'PERFECT_KEY':
      return '#398ab5';
    case 'PRIMARY_KEY':
      return '#00993f';
    default:
      return '#f29600';
  }
}

function assocSymbol(field) {
  switch (field.qKeyType) {
    case 'PERFECT_KEY':
      return '1';
    case 'PRIMARY_KEY':
      return '0/1';
    default:
      return '*';
  }
}

function toSubsetRatioText(qSubsetratio) {
  if (qSubsetratio === 1) {
    return '';
  } if (qSubsetratio === 0) {
    return '0%';
  }
  const subsetRatioText = `${Math.round(qSubsetratio * 100)}%`;
  if (subsetRatioText === '100%') {
    return '>99%';
  } if (subsetRatioText === '0%') {
    return '<1%';
  }
  return subsetRatioText;
}

function toSubsetRatioTitle(field) {
  if (!!field.qnPresentDistinctValues && !!field.qnTotalDistinctValues && field.qnPresentDistinctValues < field.qnTotalDistinctValues) {
    return `${field.qnPresentDistinctValues} out of ${field.qnTotalDistinctValues} ${field.qName} values are present in the ${field.srcTable.qName} table.\nThe remaining ${field.qnTotalDistinctValues - field.qnPresentDistinctValues} values only exist in other tables (${field.otherTables.join('')})`;
  }
  return '';
}
function sortTablesBySize(tables) {
  const array = Object.values(tables);
  array.sort((a, b) => b.qNoOfRows - a.qNoOfRows);
  return array.map(item => item.qName);
}

function sortFieldsByKeyAndName(fields) {
  const array = Object.values(fields);
  array.sort((a, b) => {
    if (a.qKeyType === 'NOT_KEY' && b.qKeyType !== 'NOT_KEY') {
      return 1;
    }
    if (a.qKeyType !== 'NOT_KEY' && b.qKeyType === 'NOT_KEY') {
      return -1;
    }
    return a.qName.localeCompare(b.qName);
  });
  return array.map(item => item.qName);
}

function isKey(cell) {
  return cell.qKeyType && cell.qKeyType !== 'NOT_KEY';
}

function biggestTableNotAnalyzed(listOfTables, tablesAlreadyAnalyzedMap) {
  return listOfTables.find(table => !tablesAlreadyAnalyzedMap[table]);
}


class QueryModel {
  constructor(tablesAndKeys, userChosenStartTable) {
    const grid = {};
    const fields = {};
    const tables = {};
    const tablesNamesOfFieldMapMap = {};
    tablesAndKeys.qtr.forEach((originalTable) => {
      const table = JSON.parse(JSON.stringify(originalTable)); // Clone so we can append information to the structure safely
      tables[table.qName] = table;
      table.qFields.sort((a, b) => a.qName.localeCompare(b.qName));
      table.qFields.forEach((_field) => {
        const field = _field;
        field.srcTable = table;
        field.here = 'det var här';
        fields[field.qName] = fields[field.qName] || field;
        grid[field.qName] = grid[field.qName] || {};
        grid[field.qName][table.qName] = field;
        tablesNamesOfFieldMapMap[field.qName] = tablesNamesOfFieldMapMap[field.qName] || {};
        tablesNamesOfFieldMapMap[field.qName][table.qName] = true;
      });
    });

    console.log('tablesAndKeys', tablesAndKeys);
    const tableArray = sortTablesBySize(tables);
    const fieldArray = sortFieldsByKeyAndName(fields);

    this.tablesNamesOfFieldMapMap = tablesNamesOfFieldMapMap;
    this.grid = grid;
    this.fields = fields;
    this.tables = tables;
    this.originalTableNamesSortedBySize = tableArray;
    this.originalFieldNamesSortedByKeyAndName = fieldArray;
    this.resultTableList = [];
    this.resultFieldList = [];

    const tablesAlreadyAnalyzed = {};
    let actualStartTable = userChosenStartTable || biggestTableNotAnalyzed(this.originalTableNamesSortedBySize, tablesAlreadyAnalyzed);

    while (actualStartTable) {
      tablesAlreadyAnalyzed[actualStartTable] = true;
      this.analyzeTable(actualStartTable, tablesAlreadyAnalyzed, '');
      actualStartTable = biggestTableNotAnalyzed(this.originalTableNamesSortedBySize, tablesAlreadyAnalyzed);
    }
    console.log('this.resultFieldList', this.resultFieldList);
    this.fillInGridInfo(grid);
    console.log('this.resultFieldList', this.resultFieldList);
  }

  getTableField(tableName, fieldName) {
    return this.grid[fieldName][tableName];
  }

  fillInGridInfo(gridIn) {
    // Fill in blanks

    const grid = gridIn;
    for (let f = 0; f < this.resultFieldList.length; f += 1) {
      for (let t = 0; t < this.resultTableList.length; t += 1) {
        const tableName = this.resultTableList[t];
        const fieldName = this.resultFieldList[f];
        let cell = grid[fieldName][tableName];
        if (!cell) {
          cell = {
            isKey: false, qKeyType: 'NOT_KEY', isEmpty: true, betweenKeys: true, insideTable: true,
          }; // The default betweenKeys will be overriden
          grid[fieldName][tableName] = cell;
        } else {
          cell.betweenKeys = true;
          cell.isKey = true;
          cell.isEmpty = false;
          cell.insideTable = true;
          cell.backgroundColor = colorOfField(cell);
          cell.assocSymbol = assocSymbol(cell);
          cell.tables = this.tablesOfField(fieldName);
          cell.otherTables = this.otherTablesOfField(tableName, fieldName);
          cell.subsetRatioText = toSubsetRatioText(cell.qSubsetRatio);
          cell.subsetRatioTitle = toSubsetRatioTitle(cell);
        }
      }
    }
    // Loop over fields from top to bottom
    for (let f = 0; f < this.resultFieldList.length; f += 1) {
      const fieldName = this.resultFieldList[f];

      // Loop over tables left to right
      for (let t = 0; t < this.resultTableList.length; t += 1) {
        const tableName = this.resultTableList[t];
        const cell = grid[fieldName][tableName];
        if (cell.qKeyType === 'NOT_KEY') {
          cell.outsideKeyY = true;
          cell.betweenKeys = false;
        } else {
          cell.firstKey = true;
          break;
        }
      }
      // Loop over tables right to left
      for (let t = this.resultTableList.length - 1; t >= 0; t -= 1) {
        const tableName = this.resultTableList[t];
        const cell = grid[fieldName][tableName];
        if (cell.qKeyType === 'NOT_KEY') {
          cell.outsideKeyY = true;
          cell.betweenKeys = false;
        } else {
          cell.lastKey = true;
          break;
        }
      }

      for (let t = 0; t < this.resultTableList.length - 1; t += 1) {
        const tableName = this.resultTableList[t];
        const nextTableName = this.resultTableList[t + 1];
        const cell = grid[fieldName][tableName];
        const nextcell = grid[fieldName][nextTableName];
        if (isKey(cell) && nextcell.betweenKeys) {
          cell.hasAssociationToRight = true;
        } else {
          cell.hasAssociationToRight = false;
        }
      }

      for (let t = this.resultTableList.length - 1; t >= 1; t -= 1) {
        const tableName = this.resultTableList[t];
        const nextTableName = this.resultTableList[t - 1];
        const cell = grid[fieldName][tableName];
        const nextcell = grid[fieldName][nextTableName];
        if (isKey(cell) && nextcell.betweenKeys) {
          cell.hasAssociationToLeft = true;
        } else {
          cell.hasAssociationToLeft = false;
        }
      }
    }

    for (let t = 0; t < this.resultTableList.length; t += 1) {
      const tableName = this.resultTableList[t];
      // For this field:
      for (let f = 0; f < this.resultFieldList.length; f += 1) {
        const fieldName = this.resultFieldList[f];
        const cell = grid[fieldName][tableName];
        if (cell.qKeyType === 'NOT_KEY') {
          cell.insideTable = false;
        } else {
          break;
        }
      }
    }


    let minAllowedLevel = 0;
    for (let t = 0; t < this.resultTableList.length; t += 1) {
      const tableName = this.resultTableList[t];
      // For this field:
      for (let f = this.resultFieldList.length - 1; f >= 0; f -= 1) {
        const fieldName = this.resultFieldList[f];
        const cell = grid[fieldName][tableName];
        if (!cell.isEmpty || f <= minAllowedLevel) {
          minAllowedLevel = f;
          break;
        } else {
          cell.isBelowKeys = true;
        }
      }
    }

    for (let f = 0; f < this.resultFieldList.length; f += 1) {
      const fieldName = this.resultFieldList[f];

      for (let t = 0; t < this.resultTableList.length; t += 1) {
        const tableName = this.resultTableList[t];

        const cell = grid[fieldName][tableName];
        if (cell.hasAssociationToRight) {
          let endT = t + 1;
          let endTableName = this.resultTableList[endT];
          while (grid[fieldName][endTableName]
          && !grid[fieldName][endTableName].hasAssociationToLeft) {
            endT += 1;
            endTableName = this.resultTableList[endT];
          }

          const endCell = this.grid[fieldName][endTableName];
          const startColor = colorOfField(cell);
          const endColor = colorOfField(endCell);
          for (let tmid = t + 1; tmid < endT; tmid += 1) {
            const midTableName = this.resultTableList[tmid];
            const midCell = this.grid[fieldName][midTableName];

            const midStartColor = mixColors(endColor, startColor, (tmid - t - 1) / (endT - t - 1));
            const midEndColor = mixColors(endColor, startColor, (tmid - t) / (endT - t - 1));

            midCell.cssBackgroundImage = `linear-gradient(to right, ${midStartColor} , ${midEndColor})`;
          }
          if (t + 1 === endT) {
            // The associated cells are adjacent so add some css info to shade
            // the tiny assocation bar parts
            const midColor = mixColors(startColor, endColor, 0.5);
            cell.cssRightAssocationBackgroundImage = `linear-gradient(to right, ${startColor} , ${midColor})`;
            endCell.cssLeftAssocationBackgroundImage = `linear-gradient(to right, ${midColor} , ${endColor})`;
          }
        }
      }
    }
  }

  getFieldsSortedByAssocDepth(currentTable, tablesAlreadyAdded) {
    // console.log('Get depth', currentTable, tablesAlreadyAdded);
    const self = this;

    const countDepth = (tableName, fieldName, traversedTables) => {
      let maxFurtherDepth = 0;
      const linkedTables = self.tablesOfField(fieldName);
      linkedTables.forEach((linkedTable) => {
        if (!traversedTables[linkedTable]) {
          // eslint-disable-next-line no-param-reassign
          traversedTables[linkedTable] = true;
          self.fieldsOfTable(linkedTable).forEach((furtherField) => {
            const furtherDepth = countDepth(linkedTable, furtherField, traversedTables);
            if (furtherDepth > maxFurtherDepth) {
              maxFurtherDepth = furtherDepth;
            }
          });
        }
      });
      return 1 + maxFurtherDepth;
    };


    const depthOfField = (fieldName) => {
      const traversedTables = {};
      tablesAlreadyAdded.forEach((tableName) => {
        traversedTables[tableName] = true;
      });
      return countDepth(currentTable, fieldName, traversedTables);
    };


    this.fieldsOfTable(currentTable).forEach(() => {
      const traversedTables = {};
      tablesAlreadyAdded.forEach((tableName) => {
        traversedTables[tableName] = true;
      });
      // console.log('depth', currentTable, fieldName, countDepth(currentTable, fieldName, traversedTables));
    });

    const result = this.fieldsOfTable(currentTable).slice(0);
    result.sort((a, b) => depthOfField(a) - depthOfField(b));
    return result;
  }

  analyzeTable(currentTable, tablesAlreadyAnalyzed, depth) {
    if (this.resultTableList.indexOf(currentTable) === -1) {
      this.resultTableList.push(currentTable);
    }

    // Iterate over all keys for the current table
    const keyFields = this.getFieldsSortedByAssocDepth(currentTable, this.resultTableList);
    // console.log(`${depth}Add table:`, currentTable, keyFields);
    keyFields.forEach((keyField) => {
      const existIndex = this.originalFieldNamesSortedByKeyAndName.indexOf(keyField);
      if (existIndex >= 0) {
        // Move the key from the original list of fields into the result list
        this.originalFieldNamesSortedByKeyAndName.splice(existIndex, 1);
        this.resultFieldList.push(keyField);
        // console.log(`${depth}Add key`, keyField);
      } else {
        // console.log(`${depth}(key already added)`, keyField);
      }
      const tablesOfNewKey = this.tablesOfField(keyField);
      // Iterate over all tables associated with the key and register them for analysis
      tablesOfNewKey.forEach((tableName) => {
        if (!tablesAlreadyAnalyzed[tableName]) {
          // eslint-disable-next-line no-param-reassign
          tablesAlreadyAnalyzed[tableName] = true;
          this.analyzeTable(tableName, tablesAlreadyAnalyzed, `${depth + keyField}.${tableName}/`);
        } else if (this.resultTableList.indexOf(tableName) === -1) {
          this.resultTableList.push(tableName);
          // console.log(`${depth} *** table already analyzed, adding anyway:`, tableName);
        } else {
          // console.log(`${depth} *** table already added:`, tableName);
        }
      });
    });
  }

  tablesOfField(fieldName) {
    return Object.keys(this.tablesNamesOfFieldMapMap[fieldName]);
  }

  otherTablesOfField(tableName, fieldName) {
    return Object.keys(this.tablesNamesOfFieldMapMap[fieldName]).filter(name => name !== tableName);
  }

  fieldsOfTable(tableName) {
    const keys = this.tables[tableName].qFields.filter(field => field.qKeyType !== 'NOT_KEY');
    keys.sort((a, b) => b.qnPresentDistinctValues - a.qnPresentDistinctValues);
    return keys.map(key => key.qName);
  }

  allFieldsOfTable(tableName) {
    const keys = this.tables[tableName].qFields.slice();
    keys.sort((a, b) => b.qnPresentDistinctValues - a.qnPresentDistinctValues);
    return keys.map(key => key.qName);
  }
}

exports.QueryModel = QueryModel;
