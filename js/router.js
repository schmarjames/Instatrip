define([
  'backbone',
  'views/main',
  'views/search'
  ], function(Backbone, MainView, SearchView) {

  var mainView;


  return Backbone.Router.extend({
    routes : {
      ''  : 'search',
      'photos' : 'photos'
    },

    search : function() {
      mainView.addChildView(new SearchView({
        parent : mainView
      }));

      mainView.childView.render();
    },
    photos : function() {
      if (mainView.collection == undefined) {
        this.navigate('', true);
        return;
      }
      console.log("PHOTOSSSSSSSSSSSSSSSSSS");
    },
    initialize : function() {
      mainView = new MainView({navigate : this.navigate});
      Backbone.history.start();
    }
  });
});
