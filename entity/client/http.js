"use strict";

module.exports = function($) {
    return $.require([
        'module!/entity/client/http/options.js',
        'module!/entity/client/http/response.js',
        'node!querystring',
        'node!http',
        'node!https'
    ], function(
        options,
        response,
        queryString,
        http,
        https
    ) {

        var obj = function(url, port, query) {
            this._query = {
                host: (url || '').replace(/https*:\/\//, ''),
                port: port || '',
                path: '/',
                method: 'GET',
                headers: {}
            };
            if ($.is.object(query) && !$.is.array(query)) {
                this._query = $.schema.merge(this._query, query);
            }

            this._options = new options();
            this._config = {
                https: (url.indexOf('https://') != -1),
                baseUrl: '',
                query: '',
                data: ''
            };
        };
        obj.prototype = {
            /**
             * Send request built
             *
             * @param method
             * @param url
             * @returns {*}
             * @private
             */
            _send: function(method, url) {
                this._query.headers['Content-Length'] = Buffer.byteLength(this._config.data);
                this._query.method = (method || '').toUpperCase();
                this._query.path = url + ((this._config.query != '') ? '?' + this._config.query : '');

                if (this._options.debug()) {
                    $.console.debug('apiClient: debug', $.color.cyan(this._query, '\n', this._config.data));
                }

                var self = this, p = new $.promise(), req = ((this._config.https) ? https : http).request(this._query, function(res) {
                    var out = (self._options.get('buffer')) ? Buffer.from('') : '';
                    if (!self._options.get('buffer')) {
                        res.setEncoding('utf8');
                    }
                    res.on('data', function(chunk) {
                        if (self._options.get('buffer')) {
                            out = Buffer.concat([out, chunk]);
                        } else {
                            out += chunk;
                        }
                    }).on('end', function() {
                        if (self._options.debug()) {
                            $.console.debug('apiClient: debug', $.color.cyan('request response', out));
                        }

                        var o = null;
                        if (self._options.get('buffer')) {
                            o = out;
                        } else {
                            o = (res.headers['content-type'] || '').match('json') ? ($.json.parse(out) || out) : out;
                        }

                        var status = Math.floor(o.status || res.statusCode) / 100;
                        if ($.is.object(o) && $.defined(o.status) && (status == 4 || status == 5)) {
                            p.reject(new response(res.headers, o || {error: o}));
                        } else {
                            p.resolve(new response(res, o));
                        }
                    }).on('error', function(err) {
                        if (self._options.debug()) {
                            $.console.debug('apiClient: debug', $.color.red('error', err, out));
                        }
                        p.reject(new response(res, err));
                    });
                });
                req.on('error', function(err) {
                    p.reject(new response({}, err));
                });
                req.write(this._config.data);
                req.end();
                return (p);
            },

            /**
             * Add url query onto a request
             *
             * @param data
             * @returns {obj}
             */
            query: function(data) {
                this._config.query = queryString.stringify(data);
                return (this);
            },

            /**
             * Add json data onto the request (overwrite form)
             *
             * @param data
             * @returns {obj}
             */
            json: function(data) {
                this._config.data = ($.is.object(data))? $.json.encode(data) : '';
                this.head({
                    'Content-Length': this._config.data.length,
                    'Content-Type': 'application/json'
                });
                return (this);
            },

            /**
             * Add form data onto the request (overwrite json)
             *
             * @param data
             * @returns {obj}
             */
            form: function(data) {
                this._config.data = queryString.stringify(data);
                this.head({
                    'Content-Length': this._config.data.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
                return (this);
            },

            /**
             * Set raw data to be sent
             *
             * @param data
             * @returns {obj}
             */
            data: function(data) {
                this._config.data = data;
                return (this);
            },
			
            /**
             * Set internal option for the class
             *
             * @param data
             * @returns {obj}
             */
            options: function(data) {
                if ($.is.instance(data, options)) {
                    this._options._set(data._data);
                } else {
                    this._options._set(data);
                }
                return (this);
            },

            /**
             * Set header options for the request
             *
             * @param data
             * @returns {*}
             */
            head: function(data) {
                if (!$.defined(data)) {
                    return (this._query.headers);
                }
                this._query.headers = $.schema.merge().deep(this._query.headers, data);
                return (this);
            },

            /**
             * Overwrite base setting of class
             *
             * @param data
             * @returns {*}
             */
            config: function(data) {
                if (!$.defined(data)) {
                    return (this._config);
                }
                this._config = $.schema.merge(this._config, data);
                return (this);
            },

            /**
             * Send get request to url
             *
             * @param url
             * @returns {*}
             */
            get: function(url) {
                return (this._send('get', this._config.baseUrl + url));
            },

            /**
             * Send post request to url
             *
             * @param url
             * @returns {*}
             */
            post: function(url) {
                return (this._send('post', this._config.baseUrl + url));
            },

            /**
             * Send put request to url
             *
             * @param url
             * @returns {*}
             */
            put: function(url) {
                return (this._send('put', this._config.baseUrl + url));
            },

            /**
             * Send delete request to url
             *
             * @param url
             * @returns {*}
             */
            delete: function(url) {
                return (this._send('delete', this._config.baseUrl + url));
            }
        };

        return ({'public': obj});
    });
};