'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  window.debounce = function (fun) {
    var lastTimeout = null;
    return function () {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        fun.apply(null, arguments);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
