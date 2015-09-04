define(['backbone', 'localstorage'], function(Backbone, Localstorage) {
  var LocalModel = Backbone.Model.extend({
    defaults: function(){
        return {
            likes : []
        };
    }
  });

  return LocalModel;
});
