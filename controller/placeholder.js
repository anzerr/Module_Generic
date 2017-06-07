"use strict";

module.exports = function($) {
	return $.require([
		'npm!jimp',
		'node!events'
	], function(
		jimp,
		events
	) {

		var obj = function() {
			$.file.create('cache!placeholder/');
			this._event = new events();
			this._load = {};
		};
		obj.prototype = $.extends('!controller', {
			_image: function(size) {
				var p = new $.promise(), self = this;

				new jimp(size.x, size.y, 0xccccccFF, function(err, image) {
					jimp.loadFont(jimp.FONT_SANS_16_BLACK).then(function(font) { // 969696
						var text = size.x + 'x' + size.y;
						image.print(font, (size.x / 2) - (text.length * 4.5), (size.y / 2) - 8, text);
						image.rgba(true);
						image.write($.path('cache!placeholder/' + text + '.png'), function() {
							p.resolve();
							self._event.emit(text);
						});
					}, function(e) {
						p.reject(e);
					});
				});

				return (p);
			},
			get: function(data) {
				var self = this, s = data.body.format.split('x'), size = {x: Number(s[0] || '100'), y: Number(s[1] || '100')};

				var text = size.x + 'x' + size.y, path = 'cache!placeholder/' + text + '.png';
				return ($.file.access(path).then(function() {
					return (true);
				}, function() {
					if (self._load[text]) {
						var p = new $.promise();
						self._event.on(text, function() {
							p.resolve();
						});
						return (p);
					}
					self._load[text] = true;
					return (self._image(size));
				}).then(function() {
					return (self.file({contentDisposition: 'inline', path: $.file.secure(path)}));
				}));
			}
		});

		return ({'static public': obj});
	});
};