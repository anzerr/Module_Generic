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
				var self = this, s = data.body.format.split('x'), size = {x: Number(s[0] || '100'), y: Number(s[1] || '100')};

				return (placeholder.get(data.body.format || '').then(function(path) {
					return (self.file({contentDisposition: 'inline', path: $.path(path)}));
				}, function() {
					return (self.res().status(404).data({error: 'error creating placeholder image'}));
				}));
			}
		});

		return ({'static public': obj});
	});
};