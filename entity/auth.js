"use strict";

module.exports = function($) {
	return $.require([
		//
	], function(
		//
	) {

		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			_user: {
				user_1: {
					_id: $.key.short(),
					name: 'foo1',
					type: 'bar1'
				},
				user_2: {
					_id: $.key.short(),
					name: 'foo2',
					type: 'bar2'
				},
				user_3: {
					_id: $.key.short(),
					name: 'foo3',
					type: 'bar3'
				},
				user_4: {
					_id: $.key.short(),
					name: 'foo4',
					type: 'bar4'
				},
				user_5: {
					_id: $.key.short(),
					name: 'foo5',
					type: 'bar6'
				}
			},
			is: function(data) {
				var self = this;
				return ($.promise().wait(100).then(function() {
					if (self._user[data.body.user]) {
						data.user = self._user[data.body.user];
						return (data);
					}
					return ($.promise().reject(self.res().status(400).data({
						error: 'missing user "' + (data.body.user || '') + '"'
					})));
				}));
			}
		});

		return ({'static private': obj});
	});
};
