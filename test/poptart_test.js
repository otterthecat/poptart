/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

jQuery('document').ready(function(){

test("poptart push state", 1, function(){

  stop();
  window.poptart.init();
  window.poptart.set('ajax/some/link/index.html', function(response){

    strictEqual(window.location.pathname.substr(-25), 'ajax/some/link/index.html', 'push state correctly set');
    history.go(-1);
    start();
  });

  document.getElementById('ajax_some_link').click();
});


test("poptart set callbacks", 1, function(){

    window.poptart.init();
    ok(window.poptart.getCallbacks('item'), 'successfully pulled callbacks');
});


test("poptart ajax", 2, function(){

  stop();
  window.poptart.init();
  window.poptart.set('ajax/index.html', function(response){

    strictEqual(typeof response, 'object', 'ajax response recieved');
    strictEqual(typeof response.page, 'string', 'ajax response contains state object');
    history.go('-1');
    start();
  });

  document.getElementById('ajax_link').click();
});

});
