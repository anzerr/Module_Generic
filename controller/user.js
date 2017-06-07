"use strict";

module.exports = function($) {
	return $.require([
		'module!/entity/auth.js'
	], function(
		auth
	) {

		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			get: $.midware([auth, 'is'], function(data) {

				return (this.res().data({
					info: data.user,
					time: $.time.now().get
				}));
			})
		});

		return ({'static private': obj});
	});
};
