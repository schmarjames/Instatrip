requirejs.config({
  paths : {
    jquery : '../scripts/jquery.min',
    underscore : '../scripts/underscore-min',
    backbone : '../scripts/backbone-min',
    localstorage : '../scripts/backbone.localStorage',
    autocomplete : '../scripts/jquery.easy-autocomplete.min'
  }
});

requirejs(['app'], function(App) {
  App.initialize();
});
