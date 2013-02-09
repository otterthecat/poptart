/*
 * poptart
 * https://github.com/otterthecat/poptart
 *
 * Copyright (c) 2013 Otter
 * Licensed under the MIT, GPL licenses.
 */

(function(){

  var _callbacks = {};
  var _base_url = "";

  /* set popstate event
  ---------------------- */
  window.onpopstate = function(event){

    if(event.state && _callbacks.hasOwnProperty(event.state.page)){

      _each(_callbacks[event.state.page], function(){

        this();
      });
    }
  };


  /* 'private' methods
  -------------------- */
  var _set_base_url = function(base_url_str){

    if(typeof base_url_str === 'str'){

      _base_url = base_url_str;
    } else {

      _base_url = window.location.protocol + "//" + window.location.host + window.location.pathname;
    }
  };

  var _get_new_state_url = function(href_str){

    var href = href_str.replace(_base_url, '');
    return _base_url + href;
  };

  var _getTag = function(str){

    return document.getElementsByTagName(str);
  };

  // helper function to loop through arrays
  var _each = function(obj_array, fn){

    for(var i = 0; i < obj_array.length; i += 1){

      fn.call(obj_array[i], i);
    }
  };

  // add a function to a callback object
  var _register_callback = function(name_str, fn){

    if(!_callbacks.hasOwnProperty(name_str)){

      _callbacks[name_str] = [];
    }

    _callbacks[name_str].push(fn);

  };

  // wrapper for accessing history's pushState method
  var _do_push_state = function(data, title, url){

    history.pushState(data, title, url);
  };

  // check if any functions are assigned to a specfic
  // property of _callbacks, call them (if exists)
  var _do_callbacks = function(url_str){

    if(!_callbacks.hasOwnProperty(url_str)){

      return false;
    }

    _each(_callbacks[url_str], function(){

      this();
    });
  };

  // define poptart object
  var Poptart = function(){};

  Poptart.prototype = {

    init: function(){

      _set_base_url();

      var _links = _getTag('a');
      _each(_links, function(i){

        var state = this.href;
        this.href = _get_new_state_url(state);

        this.onclick = function(e){

          e.preventDefault();

          _do_push_state({page: state, index: i}, this.title, this.href);

          _do_callbacks(state);
        };
      });
    },

    set: function(uri, fn){

      // TODO - this is far too hardcoded
      _register_callback(_get_new_state_url(uri.replace('/', '')), fn);
    },

    getCallbacks: function(name_str){

      return typeof name_str === 'string' && _callbacks.hasOwnProperty(name_str) ? _callbacks[name_str] : _callbacks;
    }
  };
 
  window.poptart = new Poptart();
}());