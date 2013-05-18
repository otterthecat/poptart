/*! Poptart - v0.1.0 - 2013-05-17
* https://github.com/servo/poptart
* Copyright (c) 2013 Otter; Licensed MIT, GPL */

(function(){

    "use strict";

  var _callbacks = {};
  var _base_url = null;

  /* set popstate event
  ---------------------- */
  window.onpopstate = function(event){

    if(event.state && _callbacks.hasOwnProperty(event.state.page)){

      _each(_callbacks[event.state.page], function(){

        // TODO - the scoping here may be a bit confusing...
        this(event.state);
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


  // used to parse which part of the uri has be updated
  var _get_new_state_url = function(href_str){

    var href = href_str.replace(_base_url, '');
    return _base_url + href;
  };


  // wrapper method to get dom element list by tag
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
  var _do_callbacks = function(url_str, data){


    if(!_callbacks.hasOwnProperty(url_str)){
      return false;
    }

    _each(_callbacks[url_str], function(){
      this(data);
    });
  };


  // create & return ajax object, second argument
  // is object to be passed into callbacks
  var _get_ajax = function(url_str, push_object){

   var _ajax = {};

    if (window.XMLHttpRequest) {

        _ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {

        _ajax = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    _ajax.open('post', url_str, true);
    _ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    _ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");


    _ajax.onreadystatechange = function(response){

      if(_ajax.readyState === 4 ){

        if(_ajax.status === 200 || _ajax.status === 301){

          // TODO - would like to clean this up
          push_object.response = _ajax.response;
          _do_push_state(push_object, push_object.title, push_object.href);
          _do_callbacks(push_object.page, push_object);
        } else {

          window.console.log("error getting ajax");
        }
      }
    };

    return _ajax.send();
  };


  // define poptart object
  var Poptart = function(){};

  Poptart.prototype = {

    init: function(){

      _set_base_url();

      // set initial page history state
      _do_push_state({
        page: 'poptart_base',
        index: null,
        title: 'default title',
        href: _base_url,
        response: null
      }, 'default', _base_url);

      _each(_getTag('a'), function(i){

        var state = this.href;
        this.href = _get_new_state_url(state);

        this.onclick = function(e){

          e.preventDefault();

          // update state to represent
          // link's page
          var push_obj = {
            page: state,
            index: i,
            title: this.title,
            href: this.href,
            response: null
          };

          var ajx = _get_ajax(push_obj.href, push_obj);
        };
      });
    },

    set: function(uri, fn){

      // remove slast if it starts the string
      // TODO - this is far too hardcoded - use regex
      if(uri.indexOf('/') !== 0){
     
        _register_callback(_get_new_state_url(uri), fn);
      } else {

        _register_callback(_get_new_state_url(uri.replace('/', '')), fn);
      }
    },

    // used to set history state captured on page load
    // TODO decide on a more accurate name?
    base: function(fn){

      _register_callback('poptart_base', fn);
    },

    getCallbacks: function(name_str){

      return typeof name_str === 'string' && _callbacks.hasOwnProperty(name_str) ? _callbacks[name_str] : _callbacks;
    }
  };
 
  window.poptart = new Poptart();
}());