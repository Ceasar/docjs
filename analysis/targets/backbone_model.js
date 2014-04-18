/*global define, window */
define(function (require, exports) {
  'use strict';

  var _         = require('underscore')
    , Backbone  = require('backbone')
    , globals   = require('utils').globals;

  // Globals
  // -------------------------------------------------------------------------

  var DEFAULT_SWATCH = 'grass';

  var TERRAIN_SWATCHES = [
    'grass', 'flowers-red', 'flowers-orange', 'flowers-blue', 'weed', 'weed-4x',
    'weed-small', 'weed-2x', 'field', 'sand-patch', 'sand', 'sand-nw', 'sand-n',
    'sand-ne', 'sand-w', 'sand-e', 'sand-sw', 'sand-s', 'sand-se',
    'sand-nw-inverse', 'sand-ne-inverse', 'sand-sw-inverse', 'sand-se-inverse'
  ];

  // Models
  // -------------------------------------------------------------------------

  /*
   * Attributes:
   *  - selectedSwatch (from the palette)
   *  - map (the current map model, a Backbone.Model with 'name' and 'tiles' attrs)
   */
  var Builder = Backbone.Model.extend({

    defaults: function () {
      return {
        selectedSwatch: DEFAULT_SWATCH
      };
    }

    /*
     * Expects a reference to the `App` model to be pass in on initialization.
     */
  , initialize: function (params) {
      this.parent = params.app;

      /*
       * Keep this model's reference to the current map in sync.
       */
      this.listenTo(this.parent, 'change:mapModel', function (app) {
        this.set('map', app.get('mapModel'));
      });

      this.on('change:tiles', _.debounce(this.saveTiles, 1000));
    }

    /*
     * Generate a 2D matrix of map tiles of the default swatch.
     */
  , generateTiles: function () {
      var rows = _.range(globals.BUILDER_DIMENSIONS.height)
        , cols = _.range(globals.BUILDER_DIMENSIONS.height);

      return _.map(rows, function (row) {
        return _.map(cols, function (col) {
          return {
            row: row
          , col: col
          , swatch: DEFAULT_SWATCH
          };
        });
      });
    }

    /*
     * Update a particular map tile to the currently selected swatch
     * ("paint" it).
     */
  , updateTileSwatch: function (tileData) {
      var tile    = this.get('map').get('tiles')[tileData.row][tileData.col];
      tile.swatch = this.get('selectedSwatch');

      this.trigger('change:tiles');
    }

    /*
     * Returns true if the map tile at the given [row, col] coordinate is
     * "terrain" (and not an "obstruction").
     */
  , hasTerrain: function (row, col) {
      var tile = this.get('map').get('tiles')[row][col];
      return _.contains(TERRAIN_SWATCHES, tile.swatch);
    }

  , resetTiles: function () {
      this.get('map').set('tiles', this.generateTiles());
    }

  , saveTiles: function () {
      var mapStorage = this.parent.get('mapStorage');
      mapStorage.saveMap(this.get('map'));
    }

  });

});
