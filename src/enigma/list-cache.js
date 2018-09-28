export default {
  types: ['Doc'],
  init(args) {
    const { api } = args;
    api.fieldCache = {};
  },
  extend: {
    getOrCreateListbox(field) {
      this.fieldCache[field] = this.fieldCache[field] || this.createSessionObject({
        qInfo: { qType: 'dmi-field' },
        qListObjectDef: {
          qDef: {
            qFieldDefs: [field],
            qSortCriterias: [{
              // ui gets messy when sorting by state:
              // qSortByState: 1, qSortByAscii: 1, qSortByNumeric: 1, qSortByLoadOrder: 1,
            }],
          },
          qInitialDataFetch: [{
            qTop: 0, qLeft: 0, qHeight: 0, qWidth: 1,
          }],
        },
      });
      return this.fieldCache[field];
    },
  },
};
