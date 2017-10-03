"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function(res, body) {
            this._response = res;
            this._header = res.headers || {};
            this._body = body || {};
        };
        obj.prototype = {
            /**
             * TODO
             *
             * @returns {*}
             */
            header: function(key) {
                if ($.defined(key)) {
                    return (this._header[key]);
                }
                return (this._header);
            },

            status: function() {
                return (this._response.statusCode);
            },

            /**
             * TODO
             *
             * @returns {*}
             */
            body: function(key) {
                if ($.defined(key) && $.is.object(this._body)) {
                    return (this._body[key]);
                }
                return (this._body);
            }
        };

        return ({'public': obj});
    });
};