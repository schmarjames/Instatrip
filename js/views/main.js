define(['backbone'], function(Backbone) {

  var MainView = Backbone.View.extend({
    el : '#wrapper',
    childView : null,
    template : null,

    initialize : function(options) {
      this.navigate = options.navigate;
    },

    addChildView : function(child) {
      this.childView = child;
    },

    transferView : function() {
      this.$el.children().fadeOut(500, function(x) {
        $(this).remove();
      });
      return this;
    },

    render : function() {}
  });

  return MainView;

});
