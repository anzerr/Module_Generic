"use strict";

module.exports = function($) {
	return $.require([
		'base!controller/response.js'
	], function(
		response
	) {

		var obj = function() {
			this._ref = {
				'default': {code: 400},
				'A100': {url: '', name: '', code: 400}
			}
		};
		obj.prototype = $.extends('!controller', {
			run: function(data) {
				var self = this;
				if ($.is.object(data) && $.is.function(data.then)) {
					return (data.then(function(res) {
						return (self.res().status(200).data(res));
					}, function(e) {
						return ($.promise().reject(self.code(e)));
					}));
				} else {
					return ((this._ref[data])? this.code(data) : this.res().status(200).data(data));
				}
			},
			code: function(code) {
				if ($.is.instance(code, response)) {
					return (code);
				}
				var ref = this._ref[code] || this._ref.default;
				return (this.res().status(ref.code).data(ref.name || code))
			}
		});

		return ({'static public': obj});
	});
};
