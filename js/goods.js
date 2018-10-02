'use strict';
(function () {
  window.GOODS_COUNT = 26;
  window.TOTAL_MAX_PRICE = 1500;
  window.MAX_PRICE = 0;
  window.MIN_PRICE = 1500;
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
    window.resetFilters();
    window.renderCatalog();
  };

  window.init = function () {
    window.onError = function () {
      window.showModal(document.querySelector('.modal--error'));
    };

    window.loadCatalog(onCatalogLoaded, window.onError);
    window.basket.goods = [];
    window.basket.render();
  };
  window.init();
})();
