// Global module
var myModule = (function () {

  // Module object
  var module = {},
    privateVariable = "Hello World",
    sharedMethod;

  function privateMethod() {
    // ...
  }

  module.publicProperty = "Foobar";
  module.publicMethod = function () {
    console.log( privateVariable );
  };

  module['publicMethod2'] = function () {
    privateMethod()
  }



  return module;

})();
