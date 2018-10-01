'use strict';
(function () {

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

  var onPaymentTypeClick = function () {
    var isCard = document.querySelector('#payment__card').checked;
    document.querySelector('#payment__card-number').required = isCard;
    document.querySelector('#payment__card-cvc').required = isCard;
    document.querySelector('#payment__card-date').required = isCard;
    document.querySelector('#payment__cardholder').required = isCard;

    window.toggleClass(document.querySelector('.payment__card-wrap'), !isCard, 'visually-hidden');
    window.toggleClass(document.querySelector('.payment__cash-wrap'), !document.querySelector('#payment__cash').checked, 'visually-hidden');
  };


  var paymentType = document.querySelector('.payment__method');
  paymentType.addEventListener('click', onPaymentTypeClick);

  var deliverType = document.querySelector('.deliver__toggle');
  deliverType.addEventListener('click', function () {
    window.toggleClass(document.querySelector('.deliver__store'), !document.querySelector('#deliver__store').checked, 'visually-hidden');
    window.toggleClass(document.querySelector('.deliver__courier'), !document.querySelector('#deliver__courier').checked, 'visually-hidden');
  });

})();
