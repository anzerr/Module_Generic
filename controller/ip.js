"use strict";

module.exports = function($) {
	return $.require([
		//
	], function(
		//
	) {

		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			get: function(data) {
				return (this.res().status(200).type('send').header({
					'Content-Type': 'text/html; charset=utf-8'
				}).data(data.remote.ip))
			}
		});

		return ({'static public': obj});
	});
};