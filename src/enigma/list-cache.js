export default {
  types: ['Doc'],
  init(args) {
    const { api } = args;
    api.session.app = api;
    api.objectCache = {};
  },
  extend: {
    getOrCreateObject(def) {
      const key = JSON.stringify(def);
      this.objectCache[key] = this.objectCache[key] || this.createSessionObject(def);
      return this.objectCache[key];
    },
  },
};
