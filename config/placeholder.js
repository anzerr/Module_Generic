"use strict";

module.exports = function() {
	return ([
		{
			method: ['get'],
			path: '/placeholder/:format',
			param: {
				format: '.*'
			},
			action: {
				controller: 'placeholder',
				method: 'get'
			}
		}
	]);
};