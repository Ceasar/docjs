(function () {
  'use strict';

  var Game = function (params) {
    this.name = params.name;
  };

  Game.prototype = Object.create(null);



  function Puzzle (params) {
    Game.call(this, params);
  }

  Puzzle.prototype = Object.create(Game);



  var Jigsaw;

  Jigsaw = function (params) {
    Puzzle.call(this, params);
    this.type = 'jigsaw';
  };

  Jigsaw.prototype = Object.create(Puzzle);



  module.exports = {
    Game: Game,
    Puzzle: Puzzle,
    Jigsaw: Jigsaw
  };

}());
