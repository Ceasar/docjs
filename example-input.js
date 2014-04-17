var games = (function (win, doc, $, undefined) {
  var Game = function (params) {
    this.name = params.name;
  };
  Game.prototype = Object.create(null);


  function Puzzle (params) {
    Game.call(this, params);
  }
  Puzzle.prototype = Object.create(Game);

  Puzzle.prototype.placePiece = function () {
    console.log('Piece placed!')
  }


  var Jigsaw;
  Jigsaw = function (params) {
    Puzzle.call(this, params);
    this.type = 'jigsaw';
  };
  Jigsaw.prototype = Object.create(Puzzle);

  function _myPrivateMethod() {
    console.log('Foo, bar');

  }

  function myPublicMethod() {
    _myPrivateMethod();
  }

  var baz = 'baz';

  return {
    Puzzle: Puzzle,
    Jigsaw: Jigsaw,
    myMethod: myPublicMethod,
    myProperty: baz
  };
}(window, document, window.jQuery));
