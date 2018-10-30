export default {
  types: ['Doc'],
  init(args) {
    const { api } = args;
    api.fieldCache = {};
  },
  extend: {
    getOrCreateListbox(field, fetchValues) {
      this.fieldCache[field] = (!fetchValues && this.fieldCache[field])
        || this.createSessionObject({
          qInfo: { qType: 'dmi-field' },
          qListObjectDef: {
            qFrequencyMode: 'V',
            qDef: {
              qFieldDefs: [field],
              qSortCriterias: [
                {
                  qSortByState: 1,
                  qSortByFrequency: 1,
                  // qSortByNumeric: 1,
                  // qSortByAscii: 1,
                  // qSortByLoadOrder: 1,
                },
              ],
            },
            qInitialDataFetch: [
              {
                qTop: 0,
                qLeft: 0,
                qHeight: fetchValues || 10,
                qWidth: 1,
              },
            ],
          },
        });
      return this.fieldCache[field];
    },
  },
};
