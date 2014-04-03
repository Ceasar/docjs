var fib, memoize, _;

_ = require("lodash");

memoize = function(f) {
var cache, memoizer;
cache = {};
memoizer = function() {
  var args;
  args = Array.prototype.slice.call(arguments);
  if (_.has(cache, args)) {
    return cache[args];
  } else {
    return cache[args] = f.apply(this, args);
  }
};
return memoizer;
};

fib = function(n) {
if (n === 0 || n === 1) {
  return n;
} else {
  return fib(n - 1) + fib(n - 2);
}
};

fib = memoize(fib);

console.log(fib(40));
