export default {
  types: ['Global'],
  init(args) {
    const { api, config } = args;
    const url = new URL(config.url);
    api.appID = decodeURI(/[^/]*$/.exec(url.pathname)[0]);
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
