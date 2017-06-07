"use strict";

module.exports = function(r, i) {
	return ({
		dependencies: {
			jszip: '2.4.0'
		},
		route: [
			r.create().set({
				method: ['get'],
				path: '/user/:user',
				param: {
					user: '.*'
				},
				action: {
					controller: 'user',
					method: 'get'
				}
			})
		],
		import: [
			/*
			i.create().set({
				module: 'other_module',
				as: 'rename_when_importing',
				path: '/entity/class/static.js' // path to object to import
			}),
			*/
		]
	});
};
