(function () {
  'use strict';

  var Game = function (params) {
    this.name = params.name;

    this.toString = function () {
      return this.name + " (game).";
    };
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


  var Poker = function () {
    this.prototype = Object.create(Game);
    this.type = 'card';
    this.description = 'No Limit Texas Hold Em';
  };

  function VideoGame () {
    this.prototype = Object.create(Game);
    this.type = 'video';
  }


  module.exports = {
    Game:       Game,
    Puzzle:     Puzzle,
    Jigsaw:     Jigsaw,
    Poker:      Poker,
    VideoGame:  VideoGame
  };

}());
