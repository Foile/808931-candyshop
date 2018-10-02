'use strict';
(function () {

  var resetForm = function (form) {
    // clearing inputs
    form.querySelectorAll('input').forEach(function (input) {
      switch (input.type) {
        case 'radio':
        case 'checkbox':
          input.checked = false;
          break;
        default:
          input.value = '';
          break;
      }
    });
  };
  var renderCardOrder = function (template, good) {
    if (good.countInBasket === 0) {
      window.basket.delete(good);
    }
    var card = template.cloneNode(true);
    card.querySelector('.card-order__title').textContent = good.name;
    card.querySelector('.card-order__price').textContent = good.price + ' ₽';
    var img = card.querySelector('.card-order__img');
    img.src = window.picturePath + good.picture;
    img.alt = good.name;
    card.querySelector('.card-order__count').value = good.countInBasket;
    card.querySelector('.card-order__btn--decrease').addEventListener('click', function () {
      good.countInBasket += -1;
      window.goods[window.goods.indexOf(good)].amount += 1;
      card.querySelector('.card-order__count').value = good.countInBasket;
      if (good.countInBasket === 0) {
        window.basket.delete(good);
      }
      if (good.amount > 0) {
        window.basket.render();
      }
      window.renderCatalog();
    });
    if (window.goods[window.goods.indexOf(good)].amount > 0) {
      card.querySelector('.card-order__btn--increase').addEventListener('click', function () {
        window.basket.add(good);
        window.goods[window.goods.indexOf(good)].amount += -1;
        window.renderCatalog();
        card.querySelector('.card-order__count').value = good.countInBasket;
        if (good.amount <= 0) {
          window.basket.render();
        }
      });
    }
    card.querySelector('.card-order__close').addEventListener('click', function () {
      window.basket.delete(good);
      window.goods[window.goods.indexOf(good)].amount += good.count;
      window.renderCatalog();
    });
    return card;
  };

  var onOrderSubmit = function (evt) {
    var form = evt.target;
    evt.preventDefault();
    var formData = new FormData(form);
    var onLoad = function () {
      var successModal = document.querySelector('.modal--success');
      window.showModal(successModal);
      resetForm(form);
      window.init();

    };
    window.sendOrder(formData, onLoad, window.onError);
  };
  var basketTemplate = document.querySelector('#card-order')
    .content.querySelector('.goods_card');
  var togglePayForm = function (form, enable) {
    form.addEventListener('submit', onOrderSubmit);
    form.querySelectorAll('input').forEach(function (input) {
      input.disabled = !enable;
    });
    form.querySelectorAll('fieldset').forEach(function (input) {
      input.disabled = !enable;
    });
    if (!enable) {
      form.removeEventListener('submit', onOrderSubmit);
    }
  };

  window.basket = {
    goods: [],
    add: function (good) {
      if (this.goods.indexOf(good) >= 0) {
        this.goods[this.goods.indexOf(good)].countInBasket += 1;
      } else {
        this.goods.push(good);
        this.goods[this.goods.indexOf(good)].countInBasket = 1;
      }
      this.render();
    },
    delete: function (good) {
      this.goods.splice(this.goods.indexOf(good), 1);
      this.render();
    },
    render: function () {
      var basket = document.querySelector('.goods__cards');
      basket.querySelectorAll('.goods_card').forEach(function (child) {
        basket.removeChild(child);
      });
      var form = document.querySelector('.buy form');
      if (window.basket.goods.length > 0) {
        basket.classList.remove('goods__cards--empty');
        togglePayForm(form, true);
      } else {
        togglePayForm(form, false);
      }

      var fragmentBasket = document.createDocumentFragment();
      window.basket.goods.forEach(function (good) {
        fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
      });
      basket.appendChild(fragmentBasket);
      var count = this.getCount();
      this.updateBasketTopElement();
      document.querySelector('.main-header__basket').textContent = (count > 0) ? count : 'В корзине ничего нет';
    },
    getCount: function () {
      return this.goods.map(function (good) {
        return good.countInBasket;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    getBasketPrice: function () {
      return this.goods.reduce(function (a, b) {
        return a.price + b.price;
      }, 0);
    },
    updateBasketTopElement: function () {
      window.toggleClass(document.querySelector('.goods__card-empty'), (this.getCount() > 0), 'visually-hidden');
    }
  };
})();
