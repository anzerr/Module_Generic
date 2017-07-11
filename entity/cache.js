"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function(shard, arr) {
            this._shard = shard;
            if (!this._cache[this._shard]) {
                this._cache[this._shard] = (arr) ? [] : {};
            }
        };
        obj.prototype = {
            _cache: {},
            get: function(key) {
                if (!key) {
                    return (this._cache[this._shard]);
                }
                return (this._cache[this._shard][key]);
            },
            add: function(a, b) {
                if ($.is.array(this._cache[this._shard])) {
                    this._cache[this._shard].push(a || b);
                    return (a || b);
                } else {
                    this._cache[this._shard][a] = b;
                    return (b);
                }
            },
            clear: function(key) {
                if (!key) {
                    this._cache[this._shard] = ($.is.array(this._cache[this._shard]))? [] : {};
                } else {
                    if ($.is.array(this._cache[this._shard])) {
                        this._cache[this._shard].splice(key, 1);
                    } else {
                        this._cache[this._shard][key] = null;
                    }
                }
                return (this);
            },
            clean: function() {
                this._cache[this._shard] = $[($.is.array(this._cache[this._shard]))? 'array' : 'object'].clean(this._cache[this._shard]);
                return (this);
            }
        };

        return ({'public': obj});
    });
};
