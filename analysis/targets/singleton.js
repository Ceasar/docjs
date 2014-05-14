var Commander = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function init() {
    // Singleton
    // Private methods and variables
    function speak(){
      console.log( "I am private" );
    }

    var speech = "Im also private";
    var health = Math.random();

    return {
      // Public methods and variables
      attack: function () {
        console.log( "The public can see me!" );
      },

      tag: "I am also public",

      getHealth: function() {
        return privateRandomNumber;
      }
    };
  };

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
})();
