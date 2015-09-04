define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var PhotoList = Backbone.View.extend({
    el : $("#wrapper"),
    initialize : function(options) {
      this.parent = options.parent;
    },

    render : function() {
      var photos = [];
      //console.log(this.parent);
      this.parent.collection.each(function(model) {
        var data = model.attributes,
            obj = {};
        obj["url"] = data.images.standard_resolution.url;
        obj["id"] = data.id;
        photos.push(obj);
      });

      console.log(photos);
    }
  });

  return PhotoList;
});
