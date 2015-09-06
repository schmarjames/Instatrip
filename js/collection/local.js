define(['backbone', 'localstorage'], function(Backbone, Localstorage) {
  var LocalData = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("InstatripData"),
    initialize : function() {
      var self = this;
      this.localStorage.findAll().forEach(function(model) {
        self.add(model);
      });
    }
  });

  return LocalData;
});
