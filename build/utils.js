(function() {
  var Promise,
    __slice = [].slice;

  Promise = require('rsvp').Promise;


  /*
   * Call a Node-style async function and return a promise.
   *
   * @param {function} fn A function that accepts a Node-style callback.
   * @param {...*} var_args A variable number of arguments to pass to the Node function.
   * @return {Promise}
   */

  exports.q = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return new Promise(function(resolve, reject) {
      var cb;
      cb = function() {
        var err, var_args;
        err = arguments[0], var_args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err) {
          return reject(err);
        } else if (var_args.length > 1) {
          return resolve(Array.prototype.slice.call(var_args));
        } else {
          return resolve(var_args[0]);
        }
      };
      args.push(cb);
      return fn.apply(fn, args);
    });
  };

}).call(this);
