export default {
  types: ['dmi-field'],

  init(args) {
    const { api } = args;
    api.layoutCache = null;
    api.on('changed', () => {
      api.layoutCache = null;
    });
  },
  override: {
    getLayout(base) {
      const clearPending = (result) => {
        this.layoutCache = null;
        if (result instanceof Error) {
          throw result;
        }
        return result;
      };
      if (!this.layoutCache) {
        this.layoutCache = base().then(clearPending).catch(clearPending);
      }
      return this.layoutCache;
    },
  },
};
