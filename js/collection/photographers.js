define(['backbone'], function(Backbone) {

  var Photographers = Backbone.Collection.extend({
    url : "",
    initialize : function(options) {
      console.log(options);
      this.tag = options.tagName;
      console.log(this.url);
    },
    sync : function(method, collection, options) {
      // By setting the dataType to "jsonp", jQuery creates a function
      // and adds it as a callback parameter to the request, e.g.:
      // [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
      // If you want another name for the callback, also specify the
      // jsonpCallback option.
      // After this function is called (by the JSONP response), the script tag
      // is removed and the parse method is called, just as it would be
      // when AJAX was used.
      options.dataType = "jsonp";
      return Backbone.sync(method, collection, options);
    },
    parse : function(data) {
      return data.data;
    }
  });

  return Photographers;
});
