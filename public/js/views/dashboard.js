define([
  'jquery',
  'underscore',
  'backbone',
  '../text!../templates/dashboard.html'
  ], function($, _, Backbone, DashboardTemplate) {

  var DashboardView = Backbone.View.extend({
    el : $("#wrapper"),

    initialize : function(options) {
      this.local = options.local;
      this.navigate = options.navigate;
      this.render();
    },

    render : function() {
      if(this.$el.find("#dashboard").length > 0) { this.$el.find("#dashboard").remove(); }
      var localRecordsLength = this.local.collection.localStorage.records.length,
          likesTotal = (localRecordsLength > 0) ? localRecordsLength : 0,
          template = _.template(DashboardTemplate),
          search = template({liketotal : likesTotal});
      $(this.el).prepend(search);
    },

    events : {
      'click button.like' : 'displayLikedPhotos'
    },

    displayLikedPhotos : function(e) {
      e.preventDefault();
      if (this.local.collection.localStorage.records.length > 0) {
        this.navigate('likedphotos', true);
        return;
      }
    }
  });

  return DashboardView;

});
