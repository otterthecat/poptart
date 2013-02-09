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



test("poptart push state", 1, function(){

  window.poptart.init();

  document.getElementById('test_link').click();

  var uri = window.location.pathname;
  strictEqual(uri.substr(-10), '/some/link', 'push state correctly set');

  history.go(-1);
});


test("poptart triggers function on push state", 1, function(){


  var _test_boolean = false;

  window.poptart.init();
  window.poptart.set("/new/test", function(x){

    _test_boolean = true;
  });

  document.getElementById('boolean_link').click();
  strictEqual(_test_boolean, true, "content updated via push state");

  history.go(-1);
});


test("poptart set callbacks", 1, function(){

    window.poptart.init();
    ok(window.poptart.getCallbacks('item'), 'successfully pulled callbacks');
});
