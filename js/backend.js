'use strict';
(function () {
  var _URL_LOAD = 'https://js.dump.academy/candyshop/data';
  var _URL_SAVE = 'https://js.dump.academy/candyshop';
  var _HTML_OK = 200;
  var _TIMEOUT = 10000;

  var sendRequest = function (method, url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === _HTML_OK) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = _TIMEOUT;
    xhr.open(method, url);
    xhr.send(data);
  };
  window.backend = {
    loadCatalog: function (onLoad, onError) {
      sendRequest('GET', _URL_LOAD, undefined, onLoad, onError);
    },
    sendOrder: function (data, onLoad, onError) {
      sendRequest('POST', _URL_SAVE, data, onLoad, onError);
    }
  };
})();
