requirejs.config({
  paths : {
    jquery : '../../bower_components/jquery/dist/jquery.min',
    underscore : '../../bower_components/underscore/underscore-min',
    backbone : '../../bower_components/backbone/backbone-min',
    localstorage : '../../bower_components/backbone.localStorage/backbone.localStorage',
    autocomplete : '../../scripts/jquery.easy-autocomplete.min'
  }
});

requirejs(['app'], function(App) {
  App.initialize();
});
