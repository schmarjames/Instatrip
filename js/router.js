define([
  'backbone',
  'views/main',
  'views/search'
  ], function(Backbone, MainView, SearchView) {

  var mainView;


  return Backbone.Router.extend({
    routes : {
      ''  : 'search'
    },

    search : function() {
      mainView.addChildView(new SearchView({
        parent : mainView
      }));

      mainView.childView.render();
    },
    initialize : function() {
      mainView = new MainView();
      Backbone.history.start();
    }
  });
});
