define([
  'backbone',
  'views/dashboard',
  'views/main',
  'views/search',
  'views/photoList'
], function(Backbone, DashboardView, MainView, SearchView, PhotoListView) {

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
      if (mainView.collection === undefined) {
        this.navigate('', true);
        return;
      }

      mainView
        .transferView()
        .addChildView(new PhotoListView({
          parent : mainView
        }));

      mainView.childView.render();
    },
    initialize : function() {

      mainView = new MainView({
        dashboard : DashboardView,
        navigate : this.navigate
      });

      Backbone.history.start();
    }
  });
});
