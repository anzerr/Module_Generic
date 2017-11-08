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
					'<link rel="icon" type="image/png" href="/favicon.png"/>',
					'<style>',
					'body, html {margin:0;padding:0;width:100%;height:100%;}',
					'#container {width:100%;height:100%;}',
					[ // loader
						'.spinner {',
							'margin: 0px auto;',
							'width: 50px;',
							'height: 40px;',
							'text-align: center;',
							'font-size: 10px;',
						'}',
						'',
						'.spinner > div {',
							'background-color: #333;',
							'height: 100%;',
							'width: 6px;',
							'display: inline-block;',
							'margin: 1px;',
							'',
							'-webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;',
							'animation: sk-stretchdelay 1.2s infinite ease-in-out;',
						'}',
						'',
						'.spinner .rect2 {',
							'-webkit-animation-delay: -1.1s;',
							'animation-delay: -1.1s;',
						'}',
						'',
						'.spinner .rect3 {',
							'-webkit-animation-delay: -1.0s;',
							'animation-delay: -1.0s;',
						'}',
						'',
						'.spinner .rect4 {',
							'-webkit-animation-delay: -0.9s;',
							'animation-delay: -0.9s;',
						'}',
						'',
						'.spinner .rect5 {',
							'-webkit-animation-delay: -0.8s;',
							'animation-delay: -0.8s;',
						'}',
						'',
						'@-webkit-keyframes sk-stretchdelay {',
							'0%, 40%, 100% { -webkit-transform: scaleY(0.4) }',
							'20% { -webkit-transform: scaleY(1.0) }',
						'}',
						'',
						'@keyframes sk-stretchdelay {',
							'0%, 40%, 100% {',
								'transform: scaleY(0.4);',
								'-webkit-transform: scaleY(0.4);',
							'}  20% {',
								'transform: scaleY(1.0);',
								'-webkit-transform: scaleY(1.0);',
							'}',
						'}',
						'#loader {',
							'position: absolute;',
							'z-index: 999;',
							'top: 0px;',
							'left: 0px;',
							'width: 100%;',
							'height: 100%;',
							'background: white;',
							'-webkit-transition: all 2000ms ease;',
							'transition: all 2000ms ease;',
						'}'
					].join(' '),
					'</style>',
					'</head>',
					'<body>',
					[
						'<div id="loader">',
							'<div style="height:calc(50% - 20px);">',
							'</div>',
							'<div class="spinner">',
								'<div class="rect1"></div>',
								'<div class="rect2"></div>',
								'<div class="rect3"></div>',
								'<div class="rect4"></div>',
								'<div class="rect5"></div>',
							'</div>',
						'</div>'
					].join(''),
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

				var self = this, p = $.promise();

				var out = $.schema.copy(self._index.content);

				if (data.header) {
					out.splice(5, 0, ($.is.array(data.header))? data.header.join('') : data.header);
				}

				if (data.main) {
					out.splice(14, 0, '<script type="text/javascript" src="' + data.main + '"></script>');
				}

				$.file.write(path, out.join('')).then(function() {
					self._index.cache[key] = true;
					p.resolve(self.file({contentDisposition: 'inline', path: path}));
				}, function() {
					p.resolve(self.res().status(500).data({error: 'M204'}));
				})

				return (p);
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
