define(['backbone'], function(Backbone) {

  var MainView = Backbone.View.extend({
    el : '#wrapper',
    childView : null,
    template : null,

    initialize : function(options) {
      console.log("main view");
    },

    addChildView : function(child) {
      this.childView = child;
    },

    render : function() {}
  });

  return MainView;

});
