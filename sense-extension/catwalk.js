/* globals define */
/* eslint-disable import/no-amd */

define(
  ['qlik'],
  (qlik) => ({
    support: {
      snapshot: false,
      export: false,
      exportData: false,
    },
    paint($element) {
      qlik.currApp().getAppLayout().then((applayout) => {
        const wsString = applayout.session.cacheName;
        const cleandWS = wsString.substring(0, wsString.indexOf('?'));
        $element.empty();
        $element.append(`
          <a target="_blank" rel="noopener noreferrer" href="https://catwalk.qlik.dev/?engine_url=${cleandWS}">
            <img src="/extensions/catwalk/catwalk.svg" />
          </a>
        `);
        return null;
      }).catch((error) => {
        console.log('error', error); // eslint-disable-line no-console
      });
      return qlik.Promise.resolve();
    },
  }),
);
