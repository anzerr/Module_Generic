"use strict";

module.exports = function(r) {
	return ([
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
		]);
};