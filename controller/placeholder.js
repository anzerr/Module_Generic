"use strict";

module.exports = function($) {
	return $.require([
		'module!/entity/placeholder.js'
	], function(
		placeholder
	) {

		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			get: function(data) {
				const self = this;
				return (placeholder.get(data.body.format || '').then(function(path) {
					return (self.file({
						header: {
							'Cache-Control': 'public, max-age=31536000'
						},
						contentDisposition: 'inline',
						path: $.path(path)
					}));
				}, function() {
					return (self.res().status(404).data({error: 'error creating placeholder image'}));
				}));
			}
		});

		return ({'static public': obj});
	});
};