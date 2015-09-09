define([
  'jquery',
  'underscore',
  'backbone',
  '../models/local',
  '../text!../templates/photoList.html'
], function($, _, Backbone, LocalModel, PhotoListTemplate) {
  var PhotoList = Backbone.View.extend({
    el : $("#wrapper"),
    initialize : function(options) {
      this.parent = options.parent;
      this.displayLikes = options.displayLikes;
      this.on('likeChange', this.render, this);
    },

    render : function() {
      this.$el.children().not("#dashboard").remove();
      var that = this,
          photos = [];

      if (this.displayLikes) {

        like_ids = this.parent.local.collection.localStorage.records;
        like_ids.forEach(function(id, idx) {
          var model = (that.parent.local.collection.models[idx].attributes !== undefined) ? that.parent.local.collection.models[idx].attributes : that.parent.local.collection.models[idx],
              obj = that.generatePhotoObj(that.parent.local.collection.models[idx].attributes);
          obj.index = idx;

          photos.push(obj);
        });
      } else {
        this.parent.collection.each(function(model,idx) {
          var data = model.attributes, obj;
          obj = that.generatePhotoObj(data);
          obj.index = idx;
          photos.push(obj);
        });
      }

      var template = _.template(PhotoListTemplate);
      var data = template({_:_, photos : photos, count : 0});
      this.$el.append(data);

      this.$el.find("#photo-list-wrapper").scrollTop(this.viewState.get('currentPosition'));
    },

    generatePhotoObj : function(data) {
      var obj = {};
      obj.url = (data.images !== undefined) ? data.images.standard_resolution.url : data.url;
      obj.id = data.id;
      obj.likeStatus = this.isLiked(data.id);
      obj.likesTotal = (data.likes !== undefined) ? data.likes.count : data.likesTotal;
      return obj;
    },

    isLiked : function (id) {
      var arr = this.parent.local.collection.localStorage.records;

      for (var i=0; i <= arr.length; i++) {
        if (arr[i] == id) {  return true; }
      }
      return false;
    },

    events : {
      'click a.like-photo' : 'toggleLike'
    },

    toggleLike : function(e) {
      e.preventDefault();

      var that = this,
          $target = $(e.currentTarget),
          $scroller = $target.parents("#photo-list-wrapper"),
          photo_id = $target.parents(".image-section").attr("data-id"),
          photo_index = $target.parents(".image-section").attr("data-index");

      // Remove Like
      if(this.isLiked(photo_id)) {
        var local = this.parent.local.collection.localStorage;

        this.parent.local.collection.each(function(model) {
          if(model == undefined) return;
          if (model.id == photo_id) {
              local.destroy(model);
              that.parent.local.collection.remove(model);
          }
        });

        this.viewState.set({'currentPosition' : $scroller.scrollTop()});
        this.trigger('likeChange');
        if (this.displayLikes && local.records.length === 0) {
          this.parent.navigate('', true);
          return;
        }
      } else {
        var model_data = this.parent.collection.models[photo_index].attributes;
        var model = new LocalModel(this.generatePhotoObj(model_data));
        this.parent.local.collection.add(model);
        this.parent.local.collection.localStorage.create(model);
        this.parent.local.collection.localStorage.save();

        this.viewState.set({'currentPosition' : $scroller.scrollTop()});
        this.trigger('likeChange');
      }
    }
  });

  return PhotoList;
});
