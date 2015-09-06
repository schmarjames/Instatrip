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

requirejs.config({
  paths : {
    jquery : '../bower_components/jquery/dist/jquery.min',
    underscore : '../bower_components/underscore/underscore-min',
    backbone : '../bower_components/backbone/backbone-min',
    localstorage : '../bower_components/backbone.localStorage/backbone.localStorage',
    autocomplete : '../node_modules/easy-autocomplete/dist/jquery.easy-autocomplete.min'
  }
});

requirejs(['app'], function(App) {
  App.initialize();
});

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

/**
 * @license RequireJS text 2.0.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define(['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.14',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'] &&
            !process.versions['atom-shell'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file[0] === '\uFEFF') {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

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

define(['backbone'], function(Backbone) {

  var Photographers = Backbone.Collection.extend({
    url : "",
    initialize : function(options) {
      this.tag = options.tagName;
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

define([
  'jquery',
  'underscore',
  'backbone',
  '../text!../templates/dashboard.html'
  ], function($, _, Backbone, DashboardTemplate) {

  var DashboardView = Backbone.View.extend({
    el : $("#wrapper"),

    initialize : function(options) {
      this.local = options.local;
      this.navigate = options.navigate;
      this.render();
    },

    render : function() {
      if(this.$el.find("#dashboard").length > 0) { this.$el.find("#dashboard").remove(); }
      var localRecordsLength = this.local.collection.localStorage.records.length,
          likesTotal = (localRecordsLength > 0) ? localRecordsLength : 0,
          template = _.template(DashboardTemplate),
          search = template({liketotal : likesTotal});
      $(this.el).prepend(search);
    },

    events : {
      'click button.like' : 'displayLikedPhotos'
    },

    displayLikedPhotos : function(e) {
      e.preventDefault();
      if (this.local.collection.localStorage.records.length > 0) {
        this.navigate('likedphotos', true);
        return;
      }
    }
  });

  return DashboardView;

});

define([
    'backbone',
    'collection/local',
    'models/local',
    ], function(Backbone, LocalCollection, LocalModel) {

  var MainView = Backbone.View.extend({
    el : '#wrapper',
    childView : null,
    template : null,
    local : {
      collection : null,
      model : null
    },

    initialize : function(options) {
      this.local.collection = new LocalCollection();
      this.navigate = options.navigate;
      this.dashboard = new options.dashboard(this);
    },

    addChildView : function(child) {
      var dashboard = this.$el.find("#dashboard");
      this.$el.html(dashboard);
      this.childView = child;
      this.childView.on("likeChange", this.dashboard.render, this);
    },

    transferView : function() {
      if (this.childView !== null) {
        this.childView.undelegateEvents();
        this.childView.stopListening();
        this.childView.unbind();
        this.$el.children().not("#dashboard").fadeOut(500, function(x) {
          $(this).remove();

        });
      }
      return this;
    },

    render : function() {}
  });

  return MainView;

});

define([
  'jquery',
  'underscore',
  'backbone',
  '../models/local',
  '../text!../templates/photoList.html'
], function($, _, Backbone, LocalModel, PhotoListTemplate) {
  var PhotoList = Backbone.View.extend({
    el : $("#wrapper"),
    initialize : function(options) {
      this.parent = options.parent;
      this.displayLikes = options.displayLikes;
      this.on('likeChange', this.render, this);
    },

    render : function() {
      this.$el.children().not("#dashboard").remove();
      var that = this,
          photos = [];

      if (this.displayLikes) {

        like_ids = this.parent.local.collection.localStorage.records;
        like_ids.forEach(function(id, idx) {
          var model = (that.parent.local.collection.models[idx].attributes !== undefined) ? that.parent.local.collection.models[idx].attributes : that.parent.local.collection.models[idx],
              obj = that.generatePhotoObj(that.parent.local.collection.models[idx].attributes);
          obj.index = idx;

          photos.push(obj);
        });
      } else {
        this.parent.collection.each(function(model,idx) {
          var data = model.attributes, obj;
          obj = that.generatePhotoObj(data);
          obj.index = idx;
          photos.push(obj);
        });
      }

      var template = _.template(PhotoListTemplate);
      var data = template({_:_, photos : photos, count : 0});
      this.$el.append(data);

      this.$el.find("#photo-list-wrapper").scrollTop(this.viewState.get('currentPosition'));
    },

    generatePhotoObj : function(data) {
      var obj = {};
      obj.url = (data.images !== undefined) ? data.images.standard_resolution.url : data.url;
      obj.id = data.id;
      obj.likeStatus = this.isLiked(data.id);
      obj.likesTotal = (data.likes !== undefined) ? data.likes.count : data.likesTotal;
      return obj;
    },

    isLiked : function (id) {
      var arr = this.parent.local.collection.localStorage.records;

      for (var i=0; i <= arr.length; i++) {
        if (arr[i] == id) {  return true; }
      }
      return false;
    },

    events : {
      'click a.like-photo' : 'toggleLike'
    },

    toggleLike : function(e) {
      e.preventDefault();

      var that = this,
          $target = $(e.currentTarget),
          $scroller = $target.parents("#photo-list-wrapper"),
          photo_id = $target.parents(".image-section").attr("data-id"),
          photo_index = $target.parents(".image-section").attr("data-index");

      // Remove Like
      if(this.isLiked(photo_id)) {
        var local = this.parent.local.collection.localStorage;

        this.parent.local.collection.each(function(model) {
          if(model == undefined) return;
          if (model.id == photo_id) {
              local.destroy(model);
              that.parent.local.collection.remove(model);
          }
        });

        this.viewState.set({'currentPosition' : $scroller.scrollTop()});
        this.trigger('likeChange');
        if (this.displayLikes && local.records.length === 0) {
          this.parent.navigate('', true);
          return;
        }
      } else {
        var model_data = this.parent.collection.models[photo_index].attributes;
        var model = new LocalModel(this.generatePhotoObj(model_data));
        this.parent.local.collection.add(model);
        this.parent.local.collection.localStorage.create(model);
        this.parent.local.collection.localStorage.save();

        this.viewState.set({'currentPosition' : $scroller.scrollTop()});
        this.trigger('likeChange');
      }
    }
  });

  return PhotoList;
});

define([
  'jquery',
  'autocomplete',
  'underscore',
  'backbone',
  '../collection/photographers',
  '../text!../templates/search.html'], function($, autocomplete, _, Backbone, Photographers, SearchTemplate) {

  var SearchView = Backbone.View.extend({
    el : $("#wrapper"),
    template : null,
    photographers : null,
    parent : null,
    initialize : function(options) {
      this.parent = options.parent;
    },

    render : function() {
      var that = this,
          template = _.template(SearchTemplate),
          search = template({})
          $target_fade = (this.$el.children().not("#dashboard").length > 0) ? this.$el.children() : this.$el;

      $target_fade.not("#dashboard").fadeOut(500, function() {
        that.$el.append(search);
        that.photographers = {
          data: ["everythingeverywhere", "lozula", "elialocardi", "lostncheeseland"]
        };

        $(that.el).find("#photo-search").easyAutocomplete(that.photographers);
      })
      .fadeIn(500);


    },

    events: {
      'click #search-form .submit' : 'searchPhotographer'
    },

    searchPhotographer : function(e) {
      e.preventDefault();

      var that = this,
          $target = $(e.currentTarget),
          value = $target.parent().find("#photo-search").val();
      if (this.photographers.data.indexOf(value) > -1) {
        photographers = new Photographers({tagName : value });
        photographers.url = 'https://api.instagram.com/v1/tags/'+value+'/media/recent?client_id=6c2064d60740476fbe93292ded2d69a7&callback=?';
        photographers.fetch().done(function(data) {
          that.parent.collection = photographers;
          that.parent.navigate('photos', true);
        });
      }

    }
  });

  return SearchView;

});
