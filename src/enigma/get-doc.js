export default {
  types: ['Global'],
  init(args) {
    const { api, config } = args;
    const url = new URL(config.url);
    const appID = /[^/]*$/.exec(url.pathname)[0];
    api.appID = appID;
  },
  extend: {
    async getDoc() {
      try {
        const activeDoc = await this.getActiveDoc();
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
