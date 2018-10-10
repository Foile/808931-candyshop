'use strict';
(function () {
  var CODE_ESC = 27;
  window.utils = {
    limits: {
      TOTAL_MAX_PRICE: 1500,
      MAX_PRICE: 0,
      MIN_PRICE: 1500,
      MAX_RATING_NUMBER: 100,
      GOODS_COUNT: 0
    },
    picturePath: 'img/cards/',
    onError: function (error) {
      var errorElement = document.querySelector('.modal--error');
      errorElement.querySelector('.modal__message').textContent = error;
      this.showModal(document.querySelector('.modal--error'));
    },

    newElement: function (type, cls, txt) {
      var el = document.createElement(type);
      el.classList.add(cls);
      el.textContent = txt;
      return el;
    },
    toggleClass: function (element, add, name) {
      /*  if (!add) {
          element.classList.remove(name);
        } else {
          element.classList.add(name);
        }*/
      return (!add) ? element.classList.remove(name) : element.classList.add(name);
    },
    showModal: function (modal) {
      var onEscModalClose = function (evt) {
        if (evt.keyCode === CODE_ESC) {
          window.utils.toggleClass(modal, true, 'modal--hidden');
        }
      };
      this.toggleClass(modal, false, 'modal--hidden');
      modal.querySelector('.modal__close').addEventListener('click', function () {
        window.utils.toggleClass(modal, true, 'modal--hidden');
        document.removeEventListener('keydown', onEscModalClose);
      });
      document.addEventListener('keydown', onEscModalClose);
    }
  };

})();
