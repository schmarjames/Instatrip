define([
    'backbone',
    'collection/local',
    'models/local',
    ], function(Backbone, LocalCollection, LocalModel) {

  var MainView = Backbone.View.extend({
    el : '#wrapper',
    childView : null,
    template : null,
    local : {
      collection : null,
      model : null
    },

    initialize : function(options) {
      this.local.collection = new LocalCollection();
      this.navigate = options.navigate;
      this.dashboard = new options.dashboard(this);
    },

    addChildView : function(child) {
      var dashboard = this.$el.find("#dashboard");
      this.$el.html(dashboard);
      this.childView = child;
      this.childView.on("likeChange", this.dashboard.render, this);
    },

    transferView : function() {
      if (this.childView !== null) {
        this.childView.undelegateEvents();
        this.childView.stopListening();
        this.childView.unbind();
        this.$el.children().not("#dashboard").fadeOut(500, function(x) {
          $(this).remove();

        });
      }
      return this;
    },

    render : function() {}
  });

  return MainView;

});
