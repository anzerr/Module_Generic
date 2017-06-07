"use strict";

module.exports = function(r, i) {
	return ({
		route: [
			r.create().set({
				method: ['get'],
				path: '/placeholder/:format',
				param: {
					format: '.*'
				},
				action: {
					controller: 'placeholder',
					method: 'get'
				}
			})
		],
		import: []
	});
};