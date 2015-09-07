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
      'photos' : 'photos',
      'likedphotos' : 'likedPhotos'
    },

    search : function() {
      mainView
        .transferView()
        .addChildView(new SearchView({
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
          parent : mainView,
          displayLikes : false
        }));

      mainView.childView.viewState = new Backbone.Model();
      mainView.childView.viewState.set({'currentPosition' : 0});
      mainView.childView.render();
    },

    likedPhotos : function() {
      if (mainView.local.collection.localStorage.records.length === 0) {
        this.navigate('', true);
        return;
      }

      mainView
        .transferView()
        .addChildView(new PhotoListView({
          parent : mainView,
          displayLikes : true
        }));

      mainView.childView.viewState = new Backbone.Model();
      mainView.childView.viewState.set({'currentPosition' : 0});
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
