'use strict';
(function () {

  var PriceFilter = function () {
    this.active = true;
    this.filterMin = window.MIN_PRICE;
    this.filterMax = window.MAX_PRICE;
    this.rangeFilter = document.querySelector('.range__filter');
    this.pinLeft = this.rangeFilter.querySelector('.range__btn--left');
    this.pinRight = this.rangeFilter.querySelector('.range__btn--right');
    this.filterLine = this.rangeFilter.querySelector('.range__fill-line');
    this.pinWidth = this.pinRight.clientWidth;
    this.minX = this.rangeFilter.clientLeft - this.pinRight.clientWidth / 2;
    this.maxX = this.rangeFilter.clientLeft + this.rangeFilter.clientWidth - this.pinRight.clientWidth / 2;
    this.rangeFilter.addEventListener('click', this.onRangeFilterClick);
    this.pinRight.addEventListener('mousedown', this.onFilterPinMouseDown);
    this.pinLeft.addEventListener('mousedown', this.onFilterPinMouseDown);
    this.pinMoved = false;
    this.reset();
    return this;
  };

  PriceFilter.prototype.filtrate = function (good) {
    return (good.price >= window.priceFilter.filterMin) && (good.price <= window.priceFilter.filterMax);
  };

  PriceFilter.prototype.reset = function () {
    document.querySelector('.range__prices .range__price--min').textContent = window.MIN_PRICE;
    document.querySelector('.range__prices .range__price--max').textContent = window.MAX_PRICE;
    this.filterMin = window.MIN_PRICE;
    this.filterMax = window.MAX_PRICE;
    this.changePinPosition(this.pinLeft, this.calcFilterPosition(this.filterMin) - this.pinWidth / 2);
    this.changePinPosition(this.pinRight, this.calcFilterPosition(this.filterMax));
    this.lineUpdate();
  };
  PriceFilter.prototype.calcFilterValue = function (pos) {
    pos += this.pinWidth / 2;
    return Math.round((window.TOTAL_MAX_PRICE * pos) / this.rangeFilter.clientWidth);
  };
  PriceFilter.prototype.calcFilterPosition = function (value) {
    return Math.round((this.maxX * value) / window.TOTAL_MAX_PRICE);
  };
  PriceFilter.prototype.changePinPosition = function (element, X, min, max) {
    if (X < min) {
      X = min;
    }
    if (X > max) {
      X = max;
    }
    element.style.left = X + 'px';
  };
  PriceFilter.prototype.update = function () {
    document.querySelector('.range__prices .range__price--min').textContent = this.filterMin;
    document.querySelector('.range__prices .range__price--max').textContent = this.filterMax;
  };

  PriceFilter.prototype.lineUpdate = function () {
    var left = this.pinLeft.offsetLeft;
    var right = this.pinRight.offsetLeft;
    if (left > right) {
      right = this.pinLeft.offsetLeft;
      left = this.pinRight.offsetLeft;
    }
    this.filterMin = this.calcFilterValue(left);
    this.filterMax = this.calcFilterValue(right);
    this.filterLine.style.right = (this.maxX - right) + 'px';
    this.filterLine.style.left = (left + this.pinWidth / 2) + 'px';
    this.update();
  };

  PriceFilter.prototype.calcPin = function (X) {
    X -= this.rangeFilter.offsetLeft;
    var filterValue = this.calcFilterValue(X);
    if (X < this.minX + ((this.maxX - this.minX) / 2)) {
      this.changePinPosition(this.pinLeft, X - 0.5 * this.pinWidth, this.minX, this.pinRight.offsetLeft);
      this.filterMin = filterValue;
    } else {
      this.changePinPosition(this.pinRight, X - 0.5 * this.pinWidth, this.pinLeft.offsetLeft, this.maxX);
      this.filterMax = filterValue;
    }
    window.priceFilter.pinMoved = false;
    this.lineUpdate();
    window.renderCatalog();
  };

  PriceFilter.prototype.onRangeFilterClick = function (evt) {
    evt.preventDefault();
    window.priceFilter.pinEvt = evt;
    if (window.priceFilter.pinMoved) {
      window.priceFilter.pinMoved = false;
      return;
    }
    var X = evt.clientX;
    window.priceFilter.calcPin(X);
  };

  PriceFilter.prototype.onPinMoved = function () {
    window.priceFilter.pinMoved = true;
  };

  PriceFilter.prototype.onMouseUp = function (upEvt) {
    window.renderCatalog();
    upEvt.preventDefault();
    document.removeEventListener('mousemove', window.priceFilter.onMouseMove);
    document.removeEventListener('mouseup', window.priceFilter.onMouseUp);
    window.priceFilter.rangeFilter.addEventListener('click', window.priceFilter.onRangeFilterClick);
    window.priceFilter.rangeFilter.addEventListener('mouseleave', window.priceFilter.onPinMoved);
  };

  PriceFilter.prototype.onMouseMove = function (moveEvt) {
    window.priceFilter.pinMoved = true;
    moveEvt.preventDefault();
    var shift = window.priceFilter.startX - moveEvt.clientX;
    window.priceFilter.startX = moveEvt.clientX;
    window.priceFilter.changePinPosition(window.priceFilter.pinEvt.target, window.priceFilter.pinEvt.target.offsetLeft - shift, window.priceFilter.minX, window.priceFilter.maxX);
    window.priceFilter.lineUpdate();
    window.priceFilter.rangeFilter.removeEventListener('click', window.priceFilter.onRangeFilterClick);
  };

  PriceFilter.prototype.onFilterPinMouseDown = function (evt) {
    evt.preventDefault();
    window.priceFilter.startX = evt.clientX;
    window.priceFilter.pinEvt = evt;
    document.addEventListener('mousemove', window.priceFilter.onMouseMove);
    document.addEventListener('mouseup', window.priceFilter.onMouseUp);
  };

  window.priceFilter = new PriceFilter();
  document.querySelector('.catalog__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    window.priceFilter.reset();
    window.renderCatalog();
  });

})();
