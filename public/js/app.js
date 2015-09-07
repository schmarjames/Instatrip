define([
  'router'
  ], function(Router) {

  var initialize = function() {
    var router = new Router();

    Backbone.history.on("all", function(x,y) {
    //  console.log(Backbone.history.getFragment());
    });
  };

  return {
    initialize : initialize
  };
});
