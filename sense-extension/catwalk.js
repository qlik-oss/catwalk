define( [ 'qlik', 'jquery'
],
function (qlik, $) {
	return {
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		paint: function ($element) {
			qlik.currApp().getAppLayout().then(applayout => {
				const wsString = applayout.session.cacheName;
				const cleandWS = wsString.substring( 0, wsString.indexOf('?'));
				$element.empty();
				$element.append(`
					<a target="_blank" rel="noopener noreferrer" href="https://catwalk.core.qlik.com/?engine_url=${cleandWS}">
						<img src="/extensions/catwalk/catwalk.svg" />
					</a>
				`);


    		});

			return qlik.Promise.resolve();
		}
	};
} );

