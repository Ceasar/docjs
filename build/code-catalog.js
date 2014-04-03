(function() {
  var Model, _,
    __hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  Model = require('fishbone');

  /*
  # A simple dictionary to keep track of code pointers in target source code.
  # Includes a simple event emitter and prevents overwriting of entries (unless
  # you remove that key first).
  */


  exports.CodeCatalog = Model({
    init: function(entries) {
      var k, v, _results;
      _results = [];
      for (k in entries) {
        if (!__hasProp.call(entries, k)) continue;
        v = entries[k];
        _results.push(this[k] = v);
      }
      return _results;
    },
    add: function(name, pointer) {
      if (this.has(name)) {
        return false;
      }
      this.trigger('add', {
        name: name,
        pointer: pointer
      });
      this[name] = pointer;
      return true;
    },
    remove: function(name) {
      if (!this.has(name)) {
        return false;
      }
      this.trigger('remove', {
        name: name
      });
      delete this[name];
      return true;
    },
    has: function(name) {
      return this[name] != null;
    },
    get: function(name) {
      return this[name];
    },
    toJSON: function() {
      return _.omit(this, _.isFunction);
    }
  });

}).call(this);
