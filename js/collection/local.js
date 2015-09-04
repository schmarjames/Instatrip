define(['backbone', 'localstorage'], function(Backbone, Localstorage) {
  var LocalData = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("InstatripData")
  });

  return LocalData;
});
