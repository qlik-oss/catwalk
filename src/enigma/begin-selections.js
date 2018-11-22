// function init(args) {
//   const { api } = args;
// }

async function beginSelections(base, path) {
  try {
    await base(path);
  } catch (error) {
    if (error.code) {
      await this.session.app.abortModal(true);
      await base(path);
    }
  }
}

export default {
  types: ['dmi-field'],
  // init,
  override: {
    beginSelections,
  },
};
