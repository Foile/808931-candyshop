'use strict';
(function () {
  var goodsInBasket;
  window.basketGoods = [];
  var removeGoodFromBasket = function (g) {
    window.basketGoods.splice(window.basketGoods.indexOf(g), 1);
    window.renderBasket();
  };
  var renderCardOrder = function (template, good) {
    if (good.count === 0) {
      removeGoodFromBasket(good);
    }
    var card = template.cloneNode(true);
    card.querySelector('.card-order__title').textContent = good.name;
    card.querySelector('.card-order__price').textContent = good.price + ' ₽';
    var img = card.querySelector('.card-order__img');
    img.src = window.picturePath + good.picture;
    img.alt = good.name;
    card.querySelector('.card-order__count').value = good.count;
    card.querySelector('.card-order__btn--decrease').addEventListener('click', function () {
      good.count += -1;
      window.goods[window.goods.indexOf(good)].amount += 1;
      card.querySelector('.card-order__count').value = good.count;
      if (good.count === 0) {
        removeGoodFromBasket(good);
      }
      if (good.amount > 0) {
        window.renderBasket();
      }
      window.renderCatalog();
    });
    if (window.goods[window.goods.indexOf(good)].amount > 0) {
      card.querySelector('.card-order__btn--increase').addEventListener('click', function () {
        good.count += 1;
        window.goods[window.goods.indexOf(good)].amount += -1;
        window.renderCatalog();
        card.querySelector('.card-order__count').value = good.count;
        if (good.amount <= 0) {
          window.renderBasket();
        }
      });
    }
    card.querySelector('.card-order__close').addEventListener('click', function () {
      removeGoodFromBasket(good);
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
      window.init();
    };
    window.sendOrder(formData, onLoad, window.onError);
  };

  var togglePayForm = function (form, enable) {
    form.addEventListener('submit', onOrderSubmit);
    form.querySelectorAll('input').forEach(function (input) {
      input.removeAttribute('disabled');
      if (!enable) {
        input.setAttribute('disabled', undefined);
        form.removeEventListener('submit', onOrderSubmit);
      }
    });
    form.querySelectorAll('fieldset').forEach(function (input) {
      input.removeAttribute('disabled');
      if (!enable) {
        input.setAttribute('disabled', undefined);
        form.removeEventListener('submit', onOrderSubmit);
      }
    });
  };

  var basketTemplate = document.querySelector('#card-order')
    .content.querySelector('.goods_card');

  window.window.renderBasket = function () {
    var basket = document.querySelector('.goods__cards');
    basket.querySelectorAll('.goods_card').forEach(function (child) {
      basket.removeChild(child);
    });
    var form = document.querySelector('.buy form');
    if (window.basketGoods.length > 0) {
      basket.classList.remove('goods__cards--empty');
      togglePayForm(form, true);
    } else {
      togglePayForm(form, false);
    }

    window.toggleClass(document.querySelector('.goods__card-empty'), (window.basketGoods.length > 0), 'visually-hidden');
    goodsInBasket = 0;
    var fragmentBasket = document.createDocumentFragment();
    window.basketGoods.forEach(function (good) {
      goodsInBasket += good.count;
      fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
    });
    basket.appendChild(fragmentBasket);
    document.querySelector('.main-header__basket').textContent = (goodsInBasket > 0) ? goodsInBasket : 'В корзине ничего нет';
  };

  var checkCardNumber = function (cardNumber) {
    var i = 0;
    var sum = 0;
    var n = 0;
    var res = -1;
    while (i < cardNumber.length) {
      i++;
      if (Number(cardNumber[i - 1]) === 0) {
        sum = 1; continue;
      }
      n = Number(cardNumber[i - 1]);
      if (i % 2 > 0) {
        n = (n * 2 > 9) ? n * 2 - 9 : n * 2;
      }
      sum += n;
    }
    res = sum % 10;
    return res === 0;
  };

  var cardInput = document.querySelector('#payment__card-number');
  cardInput.addEventListener('blur', function () {
    cardInput.valid = checkCardNumber(cardInput.value);
    document.querySelector('.payment__card-wrap .payment__card-status').textContent = cardInput.valid ? 'Одобрен' : 'Неизвестен';
  });

  var setFieldRequired = function (field, required) {
    field.attributes.required = (!required) ? '' : 'required';
  };
  var togglePaymentType = function () {
    var isCard = document.querySelector('#payment__card').checked;
    window.toggleClass(document.querySelector('.payment__card-wrap'), !isCard, 'visually-hidden');
    window.toggleClass(document.querySelector('.payment__cash-wrap'), isCard, 'visually-hidden');
    if (isCard) {
      document.querySelector('.payment__card-group').childNodes.forEach(function (node) {
        setFieldRequired(node, isCard);
      });
    }

  };


  var paymentType = document.querySelector('.payment__method');
  paymentType.addEventListener('click', function () {
    togglePaymentType();
  });

  var deliverType = document.querySelector('.deliver__toggle');
  deliverType.addEventListener('click', function () {
    window.toggleClass(document.querySelector('.deliver__store'), !document.querySelector('#deliver__store').checked, 'visually-hidden');
    window.toggleClass(document.querySelector('.deliver__courier'), !document.querySelector('#deliver__courier').checked, 'visually-hidden');
  });

})();
