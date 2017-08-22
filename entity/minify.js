"use strict";

module.exports = function($) {
	return $.require([
		'core!closure.js'
	], function(
		closure
	) {

		var obj = function() {
			this._hash = {};
		};
		obj.prototype = {
			js: function(files, raw) {
				var key = $.crypto.hash($.json.encode(files) + (raw? '1' : '0'));
				console.log(key);
				if ($.defined(this._hash[key])) {
					if (this._hash[key]) {
						return ($.promise().resolve($.path('cache!tmp/' + ((raw)? '' : 'minify_') + key + '.js')));
					} else {
						return ($.promise().reject());
					}
				}

				var self = this, p = new $.promise();
				$.file.stat($.path('cache!tmp/minify_' + key + '.js')).then(function() {
					p.resolve($.path('cache!tmp/minify_' + key + '.js'));
				}, function() {
					return (true);
				}).then(function() {
					var c = new closure();
					if (raw) {
						return (c.tmp(files, key));
					} else {
						return (c.raw(files, $.path('cache!tmp/minify_' + key + '.js')));
					}
				}).then(function() {
					self._hash[key] = true;
					p.resolve($.path('cache!tmp/' + ((raw)? '' : 'minify_') + key + '.js'));
				}, function(err) {
					self._hash[key] = false;
					p.reject(err);
				});

				return (p);
			}
		};

		return ({'static public': obj});
	});
};
