"use strict";

module.exports = function($) {
	return $.require([
		'module!/entity/minify.js'
	], function(
		minify
	) {

		$.file.create('cache!index/');
		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			_index: {
				cache: {},
				content: [
					'<!DOCTYPE html>',
					'<html>',
					'<head>',
					'<meta charset="utf-8">',
					'<style>',
					'body, html {margin:0;padding:0;width:100%;height:100%;}',
					'#canvasLoader {top:0;left:0;width:100%;height:100%;position:absolute;pointer-events:none;z-index:99;}',
					'#container {position:absolute;width:100%;height:100%;}',
					'</style>',
					'</head>',
					'<body>',
					'<canvas id="canvasLoader"></canvas>',
					'<div id="container"></div>',
					'</body>',
					'</html>'
				]
			},
			_lib: {},

			files: function(path, pre, priority) {
				return (this.getFiles(path).then(function(files) {
					if ($.is.object(priority)) {
						files = files.sort(function (a, b) {
							return ((priority[b] || 5) - (priority[a] || 5));
						});
					}
					var out = [];
					for (var i in files) {
						out[i] = pre + files[i];
					}
					return (out);
				}));
			},

			getFiles: function(p) {
				var out = [];
				var run = function(path) {
					return $.file.stat(path).then(function(stat) {
						if (stat.isDirectory()) {
							return ($.file.list(path).then(function(res) {
								var wait = [];
								for (var i in res) {
									wait.push(run(path + '/' + res[i]));
								}
								return ($.all(wait));
							}));
						} else {
							if (path.match(/\.js$/)) {
								out.push(path.replace(p, ''));
							}
							return (true);
						}
					}, function() {
						return (true);
					})
				};
				if (this._lib[p]) {
					return ($.promise().resolve(this._lib[p]));
				}
				return (run(p).then(function() {
					return (out);
				}));
			},

			main: function(data) {
				var key = $.crypto.hash($.json.encode(data)), path = $.path('cache!index/' + key + '.html');
				if (this._index.cache[key]) {
					return (this.file({contentDisposition: 'inline', path: path}));
				}

				var self = this;
				return (minify.js([$.path('module!public/loader.js')]).then(function(path) {
					return ($.file.read(path));
				}).then(function(res) {
					var out = $.schema.copy(self._index.content);
					out.splice(9, 0, '<script type="text/javascript">' + res + '</script>');
					if (data.header) {
						out.splice(4, 0, ($.is.array(data.header))? data.header.join('') : data.header);
					}
					if (data.main) {
						out.splice(13, 0, '<script type="text/javascript" src="' + data.main + '"></script>');
					}

					return ($.file.write(path, out.join('')));
				}).then(function() {
					self._index.cache[key] = true;
					return (self.file({contentDisposition: 'inline', path: path}));
				}));
			},

			minify: function(path, raw) {
				var self = this, wait = [];

				for (var i in path) {
					wait.push($.file.stat(path[i]));
				}

				return $.all(wait).then(function(stat) {
					for (var i in stat) {
						if (stat[i].isDirectory()) {
							return (null);
						}
					}

					return (minify.js(path, raw));
				}, function() {
					return (null);
				}).then(function(res) {
					if (res) {
						return (self.file({contentDisposition: 'inline', path: res}));
					}
					return (self.res().status(404).data({error: 'M101'}));
				}, function(res) {
					console.log(res);
					return (self.res().status(404).data({error: 'M102'}));
				});
			}
		});

		return ({'static public': obj});
	});
};
