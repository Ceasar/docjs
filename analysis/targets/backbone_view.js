/*global define */
define(function (require, exports) {
  'use strict';

  var _         = require('underscore')
    , $         = require('jquery')
    , Backbone  = require('backbone')
    , globals   = require('utils').globals;

  // -------------------------------------------------------------------------

  exports.MapView = Backbone.View.extend({

    className: 'canvas playing',

    initialize: function () {
      this.tmpl = _.template($(globals.CANVAS_TMPL_SELECTOR).html());
    }

    /*
     * Expects information about viewable tiles in its params argument. For
     * example, if rows 0-9 and cols 0-9 should be rendered as visible,
     * `params` would look like this:
     *
     *  {
     *    row: {
     *      start: 0,
     *      end: 9
     *    },
     *    col: {
     *      start: 0,
     *      end: 9
     *    }
     *  }
     */
  , render: function (params) {
      var tiles         = this.model.get('tiles')
        , viewableRows  = tiles.slice(params.row.start, params.row.end)
        , viewableTiles = _.map(viewableRows, function (row) {
            return row.slice(params.col.start, params.col.end);
          });

      var compiledTmpl = this.tmpl({ tiles: viewableTiles });
      this.$el.html(compiledTmpl);

      return this;
    }

  , renderError: function() {
      this.$el.html('ERROR');
      return this;
    }

  });

});
