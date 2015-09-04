define([
  'jquery',
  'underscore',
  'backbone',
  '../text!../templates/photoList.html'
  ], function($, _, Backbone, PhotoListTemplate) {
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
        obj.url = data.images.standard_resolution.url;
        obj.id = data.id;
        obj.likesTotal = data.likes.count;
        photos.push(obj);
      });

      console.log(photos);

      var template = _.template(PhotoListTemplate);
      var data = template({_:_, photos : photos, count : 0});
      $(this.el).prepend(data);
    },

    events : {
      'click a.like-photo' : 'toggleLike'
    },

    toggleLike : function(e) {
      e.preventDefault();

      var that = this,
          $target = $(e.currentTarget),
          photo_id = $target.parents(".image-section").attr("data-id");
      console.log(this.parent.local);
      console.log(photo_id);
    }
  });

  return PhotoList;
});
