"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function() {};
        obj.prototype = {
            _send: function(data, event, shard) {
                var self = this, s = shard || 'none';
                for (var i in this._socket[s]) {
                    if (this._socket[s][i] && this._socket[s][i].send) {
                        (function(i) {
                            self._socket[s][i].send({
                                action: event,
                                data: data
                            }).then(function() {
                                // nothing all worked well
                            }, function() {
                                self._socket[s][i] = null;
                                self._socket[s] = $.object.clean(self._socket[s]);
                            });
                        })(i);
                    }
                }
            },
            
            _subscribe: function(socket, shard) {
                var s = shard || 'none';
                if (!this._socket[s]) {
                    this._socket[s] = {};
                }

                this._socket[s][socket.id()] = socket;
            },

            subscribe: function() {
                return (this._subscribe.apply(this, arguments));
            },

            _unsubscribe: function(socket, shard) {
                var s = shard || 'none';
                if (!this._socket[s]) {
                    this._socket[s] = {};
                }
                this._socket[s][socket.id()] = null;
                this._socket[s] = $.object.clean( this._socket[s]);
                var count = 0;
                for (var i in this._socket[s]) {
                    if (this._socket[s][i]) {
                        count += 1;
                    }
                }
                return (count);
            },

            unsubscribe: function() {
                return (this._unsubscribe.apply(this, arguments));
            }
        };

        return ({'public': obj});
    });
};
