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
      this.dashboard = new options.dashboard(this.local);
      this.navigate = options.navigate;
    },

    addChildView : function(child) {
      var dashboard = this.$el.find("#dashboard");
      this.$el.html(dashboard);
      this.childView = child;
    },

    transferView : function() {
      this.$el.children().fadeOut(500, function(x) {
        $(this).remove();
      });
      return this;
    },

    initLocalStorage : function() {


      //console.log(col.localStorage._clear());
      /*col.fetch().done(function(data) {
        console.log(col.shift());
        while ((model = col.shift())) {
          console.log(model);
          model.destroy();
        }

      });*/

      /*var model = new LocalModel();
      console.log(model);
      col.add(model);
      model.save();

      col.models.forEach(function(model){
          console.log("Model in collection: " + model.get("content"));
      });*/
    },

    render : function() {}
  });

  return MainView;

});
