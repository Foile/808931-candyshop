'use strict';
(function () {
  var onCatalogLoaded = function (data) {
    window.catalog.goods = data;
    window.utils.limits.GOODS_COUNT = data.length;
    window.catalog.goods.forEach(function (element) {
      if (element.price < window.utils.limits.MIN_PRICE) {
        window.utils.limits.MIN_PRICE = element.price;
      }
      if (element.price > window.utils.limits.MAX_PRICE) {
        window.utils.limits.MAX_PRICE = element.price;
      }
      element.isFavorite = false;
      element.inStock = element.amount > 0;
      if (element.rating.number > window.utils.limits.MAX_RATING_NUMBER) {
        window.utils.limits.MAX_RATING_NUMBER = element.rating.number;
      }
    });
    window.filter.resetAll();
    window.catalog.render();
    window.filter.renderStat();
  };
  window.init = function () {
    window.backend.loadCatalog(onCatalogLoaded, this.onError);
    window.basket.goods = [];
    window.basket.render();
  };

  window.init();
})();
