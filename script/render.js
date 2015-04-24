/**
 * Module dependencies.
 */

var webpage = require('webpage');
var args = require('system').args;
var noop = function() {};

/**
 * Script arguments.
 */

var url = args[1];
var width = args[2];
var height = args[3];
var timeout = args[4];
var format = args[5];
var clip = args[6];

/**
 * Initialize page.
 */

var page = webpage.create();
page.viewportSize = {
  width: width,
  height: height
};
page.clipRect = {
  top: 0,
  left: 0,
  width: ('true' === clip ? width : 0),
  height: ('true' === clip ? height : 0)
};

/**
 * Silence phantomjs.
 */

page.onConsoleMessage =
page.onConfirm = 
page.onPrompt =
page.onError = noop;

page.settings.resourceTimeout = 5000; // 5 seconds

page.onResourceTimeout = function(e) {
  console.log(e.errorCode);   // it'll probably be 408 
  console.log(e.errorString); // it'll probably be 'Network timeout on resource'
  console.log(e.url);         // the url whose request timed out
  phantom.exit(1);
};

/**
 * Open and render page.
 */

var pageTimeout = setTimeout(function() {
  phantom.exit();
}, timeout);

page.open(url, function (status) {
  clearTimeout(pageTimeout)

  if (status !== 'success') {
    return phantom.exit(1);
  }

  window.setTimeout(function () {
    page.evaluate(function() {
      if (!document.body.style.background) {
        document.body.style.backgroundColor = 'white';
      }
    });
    console.log(page.renderBase64(format));
    phantom.exit();
  }, 0);

});
