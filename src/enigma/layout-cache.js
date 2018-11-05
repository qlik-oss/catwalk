function init(args) {
  const { api } = args;
  api.layoutCache = null;
  api.on('changed', () => {
    api.layoutCache = null;
  });
}

function getLayout(base) {
  const clearPending = (result) => {
    if (result instanceof Error) {
      throw result;
    }
    return result;
  };
  if (!this.layoutCache) {
    this.layoutCache = base().then(clearPending).catch(clearPending);
  }
  return this.layoutCache;
}

export default [{
  types: ['dmi-field'],
  init,
  override: {
    getLayout,
  },
}, {
  types: ['Doc'],
  init,
  override: {
    getAppLayout: getLayout,
  },
}];
