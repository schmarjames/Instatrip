define([
  'jquery',
  'underscore',
  'backbone',
  '../text!../templates/dashboard.html'
  ], function($, _, Backbone, DashboardTemplate) {

  var DashboardView = Backbone.View.extend({
    el : $("#wrapper"),

    initialize : function(options) {
      this.local = options;
      this.render();
    },

    render : function() {
      var likesTotal = (this.local.collection.length > 0) ? this.local.collection : 0 ;
      var template = _.template(DashboardTemplate);
      var search = template({liketotal : likesTotal});
      $(this.el).prepend(search);
    }
  });

  return DashboardView;

});
