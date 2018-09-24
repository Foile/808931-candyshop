'use strict';
(function () {
  window.filterMinPrice = window.MIN_PRICE;
  window.filterMaxPrice = window.MAX_PRICE;
  var rangeFilter = document.querySelector('.range__filter');
  var priceRangeFilterLeft = rangeFilter.querySelector('.range__btn--left');
  var priceRangeFilterRight = rangeFilter.querySelector('.range__btn--right');
  var priceRangeFilterLine = rangeFilter.querySelector('.range__fill-line');
  var pinWidth = priceRangeFilterRight.clientWidth;

  var calcFilterValue = function (pos) {
    pos += pinWidth / 2;
    return Math.round((window.TOTAL_MAX_PRICE * pos) / rangeFilter.clientWidth);
  };

  var calcFilterPosition = function (value) {
    return Math.round((maxX * value) / window.TOTAL_MAX_PRICE);
  };

  var changePinPosition = function (element, X, min, max) {
    if (X < min) {
      X = min;
    }
    if (X > max) {
      X = max;
    }
    element.style.left = X + 'px';
  };

  var priceFilterLineUpdate = function () {
    var left = priceRangeFilterLeft.offsetLeft;
    var right = priceRangeFilterRight.offsetLeft;
    if (left > right) {
      right = priceRangeFilterLeft.offsetLeft;
      left = priceRangeFilterRight.offsetLeft;
    }
    window.filterMinPrice = calcFilterValue(left);
    window.filterMaxPrice = calcFilterValue(right);
    priceRangeFilterLine.style.right = (maxX - right) + 'px';
    priceRangeFilterLine.style.left = (left + pinWidth / 2) + 'px';
    updatePriceFilter();
  };

  window.initPriceFilter = function () {
    document.querySelector('.range__prices .range__price--min').textContent = window.MIN_PRICE;
    document.querySelector('.range__prices .range__price--max').textContent = window.MAX_PRICE;
    window.filterMinPrice = window.MIN_PRICE;
    window.filterMaxPrice = window.MAX_PRICE;
    changePinPosition(priceRangeFilterLeft, calcFilterPosition(window.filterMinPrice));
    changePinPosition(priceRangeFilterRight, calcFilterPosition(window.filterMaxPrice));
    priceFilterLineUpdate();
  };

  var updatePriceFilter = function () {
    document.querySelector('.range__prices .range__price--min').textContent = window.filterMinPrice;
    document.querySelector('.range__prices .range__price--max').textContent = window.filterMaxPrice;
  };

  window.initPriceFilter();

  var minX = rangeFilter.clientLeft - priceRangeFilterRight.clientWidth / 2;
  var maxX = rangeFilter.clientLeft + rangeFilter.clientWidth - priceRangeFilterRight.clientWidth / 2;
  var pinMoved = false;
  var onRangeFilterClick = function (evt) {
    evt.preventDefault();
    if (pinMoved) {
      pinMoved = false;
      return;
    }
    var X = evt.clientX - rangeFilter.offsetLeft;
    var filterValue = calcFilterValue(X);
    if (X < minX + ((maxX - minX) / 2)) {
      changePinPosition(priceRangeFilterLeft, X - 0.5 * pinWidth, minX, priceRangeFilterRight.offsetLeft);
      window.filterMinPrice = filterValue;
    } else {
      changePinPosition(priceRangeFilterRight, X - 0.5 * pinWidth, priceRangeFilterLeft.offsetLeft, maxX);
      window.filterMaxPrice = filterValue;
    }
    pinMoved = false;
    priceFilterLineUpdate();
    window.renderCatalog();
  };

  var onFilterPinMouseDown = function (evt) {
    evt.preventDefault();
    var startX = evt.clientX;
    var onMouseMove = function (moveEvt) {
      pinMoved = true;
      moveEvt.preventDefault();
      var shift = startX - moveEvt.clientX;
      startX = moveEvt.clientX;
      changePinPosition(evt.target, evt.target.offsetLeft - shift, minX, maxX);
      priceFilterLineUpdate();
      rangeFilter.removeEventListener('click', onRangeFilterClick);
    };
    var onMouseUp = function (upEvt) {
      window.renderCatalog();
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      rangeFilter.addEventListener('click', onRangeFilterClick);
      rangeFilter.addEventListener('mouseleave', function () {
        pinMoved = false;
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  rangeFilter.addEventListener('click', onRangeFilterClick);
  priceRangeFilterRight.addEventListener('mousedown', onFilterPinMouseDown);
  priceRangeFilterLeft.addEventListener('mousedown', onFilterPinMouseDown);

  document.querySelector('.catalog__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    window.initPriceFilter();
    window.renderCatalog();
  });
})();
