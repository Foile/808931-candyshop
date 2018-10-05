'use strict';
(function () {

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

  var basketTemplate = document.querySelector('#card-order')
    .content.querySelector('.goods_card');

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
      window.toggleClass(basket, (window.basket.goods.length <= 0), 'goods__cards--empty');
      if (window.basket.goods.length > 0) {
        window.togglePayForm(true);
      } else {
        window.togglePayForm(false);
      }

      var fragmentBasket = document.createDocumentFragment();
      window.basket.goods.forEach(function (good) {
        fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
      });
      basket.appendChild(fragmentBasket);
      this.updateBasketInfo();
    },
    getCount: function () {
      return this.goods.map(function (good) {
        return good.countInBasket;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    getBasketPrice: function () {
      return this.goods.map(function (good) {
        return good.price * good.countInBasket;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    updateBasketInfo: function () {
      var count = this.getCount();
      document.querySelector('.main-header__basket').textContent = (count > 0) ? count : 'В корзине ничего нет';
      window.toggleClass(document.querySelector('.goods__card-empty'), (count > 0), 'visually-hidden');
      var total = document.querySelector('.goods__total');
      window.toggleClass(total, (count <= 0), 'visually-hidden');
      window.toggleClass(total.querySelector('.goods__order-link'), (count <= 0), 'goods__order-link--disabled');
      var totalInfo = total.querySelector('.goods__total-count');
      totalInfo.textContent = '';
      totalInfo.appendChild(window.newElement('span', undefined, 'Итого за ' + count + ' товаров:'));
      totalInfo.appendChild(window.newElement('span', 'goods__price', this.getBasketPrice()));
      totalInfo.appendChild(window.newElement('span', 'goods__price', '₽'));
    }
  };
})();
