requirejs.config({
  paths : {
    jquery : '../www/lib/jquery/dist/jquery.min',
    underscore : '../www/lib/underscore/underscore-min',
    backbone : '../www/lib/backbone/backbone-min',
    localstorage : '../www/lib/backbone.localStorage/backbone.localStorage-min',
    autocomplete : '../node_modules/easy-autocomplete/dist/jquery.easy-autocomplete.min'
  }
});

requirejs(['app'], function(App) {
  App.initialize();
});
