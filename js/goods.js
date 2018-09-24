'use strict';
(function () {
  // window.goods = window.generateRandomGoods(window.GOODS_COUNT);
  window.GOODS_COUNT = 26;
  window.TOTAL_MAX_PRICE = 1500;
  window.MAX_PRICE = 1500;
  window.MIN_PRICE = 0;
  window.init = function () {
    var onCatalogLoaded = function (data) {
      window.goods = data;
      window.GOODS_COUNT = data.length;
      window.goods.forEach(function (element) {
        if (element.price < window.MIN_PRICE) {
          window.MIN_PRICE = element.price;
        }
        if (element.price > window.MAX_PRICE) {
          window.MAX_PRICE = element.price;
        }
      });
    };

    window.onError = function () {
      window.toggleClass(document.querySelector('.modal--error'), false, 'visually-hidden');
    };

    window.loadCatalog(onCatalogLoaded, window.onError);
    window.basketGoods = [];
    window.renderCatalog();
  };
  window.init();
})();
