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
        return activeDoc;
      } catch (e) {
        const doc = await this.openDoc(this.appID);
        return doc;
      }
    },
  },
};
