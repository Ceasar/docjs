class Game

  constructor: ({@name}) ->

  play: () ->
    console.log('Playing...')

class Puzzle extends Game

  play: () ->
    console.log('Initializing puzzle...')
    super()

class Jigsaw extends Puzzle

  play: () ->
    console.log('Initializing jigsaw...')
    super()

module.exports =
  Game:   Game
  Puzzle: Puzzle
  Jigsaw: Jigsaw

