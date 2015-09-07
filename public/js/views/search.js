define([
  'jquery',
  'autocomplete',
  'underscore',
  'backbone',
  '../collection/photographers',
  '../text!../templates/search.html'], function($, autocomplete, _, Backbone, Photographers, SearchTemplate) {

  var SearchView = Backbone.View.extend({
    el : $("#wrapper"),
    template : null,
    photographers : null,
    parent : null,
    initialize : function(options) {
      this.parent = options.parent;
    },

    render : function() {
      var that = this,
          template = _.template(SearchTemplate),
          search = template({})
          $target_fade = (this.$el.children().not("#dashboard").length > 0) ? this.$el.children() : this.$el;

      $target_fade.not("#dashboard").fadeOut(500, function() {
        that.$el.append(search);
        that.photographers = {
          data: ["everythingeverywhere", "lozula", "elialocardi", "lostncheeseland"]
        };

        $(that.el).find("#photo-search").easyAutocomplete(that.photographers);
      })
      .fadeIn(500);


    },

    events: {
      'click #search-form .submit' : 'searchPhotographer'
    },

    searchPhotographer : function(e) {
      e.preventDefault();

      var that = this,
          $target = $(e.currentTarget),
          value = $target.parent().find("#photo-search").val();
      if (this.photographers.data.indexOf(value) > -1) {
        photographers = new Photographers({tagName : value });
        photographers.url = 'https://api.instagram.com/v1/tags/'+value+'/media/recent?client_id=6c2064d60740476fbe93292ded2d69a7&callback=?';
        photographers.fetch().done(function(data) {
          that.parent.collection = photographers;
          that.parent.navigate('photos', true);
        });
      }

    }
  });

  return SearchView;

});
