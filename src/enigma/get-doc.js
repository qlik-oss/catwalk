export default {
  types: ['Global'],
  init(args) {
    const { api, config } = args;
    const appID = /[^/]*$/.exec(config.url)[0];
    api.appID = appID;
  },
  extend: {
    async getDoc() {
      try {
        const activeDoc = await this.getActiveDoc();
        // Make sure to end any selection state in the app that might have been set in the session before catwalk connected.
        activeDoc.abortModal();
        return activeDoc;
      } catch (error) {
        if (error.code) {
          const doc = await this.openDoc(this.appID);
          return doc;
        }
        throw error;
      }
    },
  },
};
