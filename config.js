"use strict";

module.exports = function() {
	return ({
		dependencies: {
			'jimp': '^0.2.27',
			'moment': '^2.13.0',
			'moment-timezone': '^0.5.4',
			'html-pdf': '^2.1.0',
			'bcryptjs': '^2.3.0'
		},
		ignore: [
			'\\/public\\/.*'
		],
		route: [
			{
				method: ['get'],
				path: '/ip',
				action: {
					controller: 'get',
					method: 'ip'
				}
			},
			'/config/placeholder.js'
		],
		import: []
	});
};
