"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function(config) {
            this._prefix = config.prefix || 'sig_';
            this._debug = config.debug || false; // use to show the reject?
            this._service = config.service;
            if (!$.defined(this._service)) {
                throw new Error('missing mongodb service to run on');
            }
        };
        obj.prototype = {
            db: function(col) {
                var a = this._service;
                if (a) {
                    return (a.collection(this._prefix + (col || 'error')));
                }
                return (null);
            },

            ObjectID: function(str) {
                var db = $.service('mongo');
                if (!db) {
                    return ('');
                }
                return (db.ObjectID(str));
            },

            update: function(col, find, data) {
                var db = this.db();
                if (!db) {
                    return ($.promise().reject('db handle missing'));
                }
                return (this.db(col).update(find, data, {upsert: true}).then(function(res) {
                    return (res);
                }, function(e) {
                    return ($.promise.reject(e));
                }));
            },

            remove: function(col, find) {
                var db = this.db();
                if (!db) {
                    return ($.promise().reject('db handle missing'));
                }
                return (this.db(col).remove(find).then(function(res) {
                    return (res);
                }, function(e) {
                    return ($.promise().reject(e));
                }));
            },

            insert: function(col, data) {
                var db = this.db();
                if (!db) {
                    return ($.promise().reject('db handle missing'));
                }
                return (this.db(col).insert(data).then(function(res) {
                    return (res);
                }, function(e) {
                    return ($.promise().reject(e));
                }));
            },

            find: function(col, find, field) {
                var db = this.db();
                if (!db) {
                    return ($.promise().reject('db handle missing'));
                }

                return (this.db(col).find(find, field).execute().then(function(res) {
                    return (res);
                }, function(e) {
                    return ($.promise().reject(e));
                }));
            }
        };

        return ({'public': obj});
    });
};
