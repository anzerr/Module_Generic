"use strict";

module.exports = function($) {
    return $.require([
        'npm!bcryptjs'
    ], function(
        bcrypt
    ) {

        var obj = function() {};
        obj.prototype = {
            hash: function(password) {
                var p = $.promise();

                bcrypt.genSalt(10, function(err, salt) {
                    if (err) {
                        p.reject(err);
                    } else {
                        bcrypt.hash(password, salt, function(err, hash) {
                            p[(err) ? 'reject' : 'resolve'](err || hash);
                        });
                    }
                });

                return (p);
            },

            compare: function(p1, p2) {
                var p = $.promise();

                bcrypt.compare(p1, p2, function(err, pass) {
                    if (err) {
                        p.reject(err);
                    } else {
                        p.resolve(pass);
                    }
                });

                return (p);
            }
        };

        return ({'static public': obj});
    });
};
