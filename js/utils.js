'use strict';
(function () {
  window.newElement = function (type, cls, txt) {
    var el = document.createElement(type);
    el.classList.add(cls);
    el.textContent = txt;
    return el;
  };

  window.toggleClass = function (element, add, name) {
    if (!add) {
      element.classList.remove(name);
    } else {
      element.classList.add(name);
    }
  };

  window.getRandomNumber = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
  };

  window.getRandomArray = function (array, count) {
    var sourceArray = array.slice(0);
    var resultArray = [];
    if (!count) {
      count = window.getRandomNumber(1, array.length);
    }

    for (var i = 0; (i < count && sourceArray.length > 0); i++) {
      var index = window.getRandomNumber(0, sourceArray.length);
      resultArray.push(sourceArray[index]);
      sourceArray.splice(index, 1);
    }
    return resultArray;
  };

  window.showModal = function (modal) {
    window.toggleClass(modal, false, 'modal--hidden');
    modal.querySelector('.modal__close').addEventListener('click', function () {
      modal.classList.add('modal--hidden');
    });
  };
})();
