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
      var template = _.template(SearchTemplate);
      var search = template({});
      $(this.el).prepend(search);

      this.photographers = {
        data: ["everythingeverywhere", "lozula", "elialocardi", "lostncheeseland"]
      };

      $(this.el).find("#photo-search").easyAutocomplete(this.photographers);
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
          console.log(photographers);
          that.parent.collection = photographers;
          that.parent.navigate('photos', true);
        });
      }

    }
  });

  return SearchView;

});
