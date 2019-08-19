
class AtPlayModel {
  /**
   * @param QueryModel model
   * @param openFieldsMap map<string,boolean>
   */
  constructor(/* QuerytModel */ model, openFieldsMap) {
    /**
     * @type QueryModel
     */
    this.model = model;

    const keysAtPlay = {};
    const tablesAtPlay = {};


    if (Object.keys(openFieldsMap).length >= 2) {
      let loopCount = 1000;
      const traverse = (fieldName, fieldTrail, tableTrail) => {
        model.tablesOfField(fieldName).forEach((linkedTableName) => {
          const tableIndexInTrail = tableTrail.indexOf(linkedTableName);
          if (tableIndexInTrail !== -1) {
            return;
          }
          model.allFieldsOfTable(linkedTableName).forEach((fieldInLinkedTable) => {
            loopCount += 1;
            if (loopCount > 100000) {
              return;
            }
            if (fieldTrail.indexOf(fieldInLinkedTable) !== -1) {
              // The linked field is already in the trail
            // } else if (tableTrail.indexOf(linkedTableName) !== -1) {
            //   console.log("Ended in same table", tableTrail, linkedTableName)
            } else if (openFieldsMap[fieldInLinkedTable]) {
            // We have reached the other end
              // let isNew = false;
              for (let i = 0; i < fieldTrail.length; i += 1) {
                // if (!keysAtPlay[fieldTrail[i]]) {
                //   isNew = true;
                // }
                keysAtPlay[fieldTrail[i]] = true;
              }
              keysAtPlay[fieldInLinkedTable] = true;
              for (let i = 0; i < tableTrail.length; i += 1) {
                tablesAtPlay[tableTrail[i]] = true;
              }
              tablesAtPlay[linkedTableName] = true;
            } else if (model.fields[fieldInLinkedTable].qKeyType !== 'NOT_KEY') {
            // We found a key in the linked table - continue traversing into it.
              if (!keysAtPlay[fieldInLinkedTable]
                && fieldTrail.indexOf(fieldInLinkedTable) === -1) {
                // Hasn't been traversed before
                const newFieldTrail = fieldTrail.concat(fieldInLinkedTable);
                const newTableTrail = tableTrail.concat(linkedTableName);

                traverse(fieldInLinkedTable, newFieldTrail, newTableTrail);
              }
            }
          });
        });
      };

      Object.keys(openFieldsMap).forEach((fieldName) => {
        if (openFieldsMap[fieldName]) {
          traverse(fieldName, [fieldName], []);
        }
      });

      Object.keys(openFieldsMap).forEach((fieldName) => {
        if (openFieldsMap[fieldName]) {
          traverse(fieldName, [fieldName], []);
        }
      });
    }
    this.keysAtPlay = keysAtPlay;
    this.tablesAtPlay = tablesAtPlay;
  }
}


exports.AtPlayModel = AtPlayModel;
