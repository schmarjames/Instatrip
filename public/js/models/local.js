define(['backbone', 'localstorage'], function(Backbone, Localstorage) {
  var LocalModel = Backbone.Model.extend({
    defaults: function(){
        return {
            id : "",
            url : "",
            likeStatus : "",
            likesTotal : ""
        };
    }
  });

  return LocalModel;
});
