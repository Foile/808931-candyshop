'use strict';
(function () {
  var shippingPicturePath = 'img/map/';
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
    return (res === 0) && (cardNumber.length >= 16) && (cardNumber.length <= 20);
  };

  var checkCvc = function (cvc) {
    return (parseInt(cvc, 10) >= 100 && (parseInt(cvc, 10) <= 999));
  };

  var checkDate = function (date) {
    var res = true;
    var dateMatch = date.match('([0-9]{2})/([0-9]{2})');
    if (!dateMatch) {
      return false;
    }
    var curDate = new Date();
    var currentYear = (curDate).getFullYear();
    var currentMonth = parseInt((curDate).getMonth().toString(), 10);
    var cardMonth = parseInt(dateMatch[1], 10);
    var cardYear = 2000;
    if (dateMatch.length > 1) {
      cardYear += parseInt(dateMatch[2], 10);
    }
    res = res &&
      (dateMatch.length > 2) &&
      (cardMonth > 0) &&
      (cardMonth <= 12) &&
      (
        (
          (cardYear === currentYear) && (cardMonth > currentMonth)
        ) || (cardYear >= currentYear)
      );
    return res;
  };

  var checkCardFields = function () {
    var isNotCard = !document.querySelector('#payment__card').checked;
    var cardNumber = document.querySelector('#payment__card-number');
    var valid = isNotCard || checkCardNumber(cardNumber.value);
    cardNumber.setCustomValidity(valid ? '' : 'Неверный номер карты');
    var res = valid;
    var cvc = document.querySelector('#payment__card-cvc');
    valid = isNotCard || checkCvc(cvc.value);
    res = res && valid;
    cvc.setCustomValidity(valid ? '' : 'Неверный CVC');
    var date = document.querySelector('#payment__card-date');
    valid = isNotCard || checkDate(date.value);
    res = res && valid;
    date.setCustomValidity(valid ? '' : 'Неверный срок действия карты');
    document.querySelector('.payment__card-wrap .payment__card-status').textContent = res ? 'Одобрен' : 'Не определён';
  };

  document.querySelectorAll('.payment__inputs > div > p > input').forEach(function (field) {
    field.addEventListener('blur', function () {
      checkCardFields();
    });
  });

  var onPaymentTypeClick = function () {
    var isCard = document.querySelector('#payment__card').checked;
    document.querySelector('#payment__card-number').required = isCard;
    document.querySelector('#payment__card-cvc').required = isCard;
    document.querySelector('#payment__card-date').required = isCard;
    document.querySelector('#payment__cardholder').required = isCard;
    window.utils.toggleClass(document.querySelector('.payment__card-wrap'), !isCard, 'visually-hidden');
    window.utils.toggleClass(document.querySelector('.payment__cash-wrap'), !document.querySelector('#payment__cash').checked, 'visually-hidden');
    checkCardFields();
  };

  var onDeliverTypeClick = function () {
    var isCourier = document.querySelector('#deliver__courier').checked;
    document.querySelector('#deliver__street').required = isCourier;
    document.querySelector('#deliver__house').required = isCourier;
    document.querySelector('#deliver__room').required = isCourier;
    window.utils.toggleClass(document.querySelector('.deliver__store'), !document.querySelector('#deliver__store').checked, 'visually-hidden');
    window.utils.toggleClass(document.querySelector('.deliver__courier'), !isCourier, 'visually-hidden');
    checkCardFields();
  };

  var paymentType = document.querySelector('.payment__method');
  var deliverType = document.querySelector('.deliver__toggle');

  var resetForm = function (form) {
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
    paymentType.removeEventListener('click', onPaymentTypeClick);
    deliverType.removeEventListener('click', onDeliverTypeClick);
  };

  var onOrderSubmit = function (evt) {
    var form = evt.target;
    var formData = new FormData(form);
    var onLoad = function () {
      var successModal = document.querySelector('.modal--success');
      window.utils.showModal(successModal);
      resetForm(form);
      window.init();
    };
    window.backend.sendOrder(formData, onLoad, window.utils.onError);
  };


  var buyForm = document.querySelector('.buy form');
  buyForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });

  var updateMap = function (name, img) {
    var map = document.querySelector('.deliver__store-map-wrap > .deliver__store-map-img');
    map.src = shippingPicturePath + img + '.jpg';
    map.alt = name;
  };

  document.querySelector('.deliver__store-list').addEventListener('change', function () {
    var selectedStore = document.querySelector('.deliver__store-list > li > input[name="store"]:checked');
    selectedStore.parentNode.src = shippingPicturePath + selectedStore.value + '.jpg';
    updateMap(selectedStore.parentNode.querySelector('label').textContent, selectedStore.value);
  });

  window.togglePayForm = function (enable) {
    buyForm.addEventListener('submit', onOrderSubmit);
    deliverType.addEventListener('click', onDeliverTypeClick);
    paymentType.addEventListener('click', onPaymentTypeClick);
    buyForm.querySelectorAll('input').forEach(function (input) {
      input.disabled = !enable;
    });
    buyForm.querySelectorAll('fieldset').forEach(function (input) {
      input.disabled = !enable;
    });
    if (!enable) {
      buyForm.removeEventListener('submit', onOrderSubmit);
    }
  };
})();
