"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function(data) {
            this._data = data || {};
        };
        obj.prototype = {
            _set: function(data) {
                this._data = $.schema.merge(this._data, data);
                return (this);
            },

            /**
             * Set or get the debug value
             *
             * @param value
             * @returns {*}
             */
            debug: function(value) {
                if (!$.defined(value)) {
                    return (this._data.debug);
                }
                this._data.debug = value;
                return (this);
            },

            /**
             * Get or set the token value
             * 
             * @param key
             * @returns {*}
             */
            token: function(key) {
                if (!$.defined(key)) {
                    return (this._data.token);
                }
                this._data.token = key;
                return (this);
            }
        };

        return ({'public': obj});
    });
};