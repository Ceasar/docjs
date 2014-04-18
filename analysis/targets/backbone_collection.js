/*global define, window */
define(function (require, exports) {
  'use strict';

  var Backbone  = require('backbone');

  exports.MapStorage = Backbone.Collection.extend({

    // API is hosted on the same server that serves this client application
    url: function (mapName) {
      return window.location.origin + '/api/maps/' + (mapName || '');
    }

  , initialize: function () {
      var that = this;
      $.get(this.url(), function(data, status, xhr){
        if(status) {
          that.set(data.maps);
          that.trigger('reset');
        }
      });
    }

  , saveMap: function (mapModel) {
      var that = this;

      $.post(this.url(mapModel.get('name')),
        { tiles: mapModel.get('tiles') }
      , function(data, status, xhr){
          if(status) {
            console.log('Should be uploaded.');
          }
      });
    }

  });

});
