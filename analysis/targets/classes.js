(function () {
  'use strict';

  var Game = function (params) {
    this.name = params.name;
  };

  Game.prototype = Object.create(null);


  var Puzzle = function (params) {
    Game.call(this, params);
  };

  Puzzle.prototype = Object.create(Game);



  module.exports = {
    Game: Game,
    Puzzle: Puzzle
  };

}());
