'use strict';
(function () {
  var Filter = function () {
    this._create();
  };
  Filter.prototype._create = function () {
    this.active = false;
    this.filtrate = function () {
      return true;
    };
    this.resetFilter = function () {
    };
    this.updateFilter = function () {
    };
  };

  var TypeFilter = function (name) {
    Filter.apply(this, arguments);
    this.name = name;
  };

  TypeFilter.prototype = Object.create(Filter.prototype);

  var getTypeFilterValue = function (control) {
    return control.parentNode.querySelector('label').textContent;
  };

  TypeFilter.prototype._create = function () {

    this.active = false;

    this.resetFilter = function () {
      document.querySelectorAll('.catalog__filter > li > input[name^="' + this.name + '"]').forEach(function (element) {
        element.checked = false;
      });
    };

    this.updateFilter = function () {
      this.active = (document.querySelector('.catalog__filter > li > input[name^="' + this.name + '"]:checked'));
    };

    this.filtrate = function (good) {
      var match = !this.active;
      document.querySelectorAll('.catalog__filter > li > input[name^="' + this.name + '"]:checked').forEach(function (filter) {
        match = match || (good.kind === getTypeFilterValue(filter));
      });
      return match;
    };
  };

  var PriceFilter = function () {
    Filter.apply(this, arguments);
    this.name = 'price';
  };
  PriceFilter.prototype = Object.create(Filter.prototype);

  var onRangeFilterClick = function (evt) {
    evt.preventDefault();
    priceFilter.pinEvt = evt;
    if (priceFilter.pinMoved) {
      pinMovedOff();
      return;
    }
    var X = evt.clientX;
    priceFilter.calcPin(X);
  };

  var pinMovedOff = function () {
    priceFilter.pinMoved = false;
  };

  var onMouseMove = function (moveEvt) {
    priceFilter.pinMoved = true;
    moveEvt.preventDefault();
    var shift = priceFilter.startX - moveEvt.clientX;
    priceFilter.startX = moveEvt.clientX;
    changePinPosition(priceFilter.pinEvt.target, priceFilter.pinEvt.target.offsetLeft - shift, priceFilter.minX, priceFilter.maxX);
    priceFilter.lineUpdate();
    priceFilter.rangeFilter.removeEventListener('click', onRangeFilterClick);
  };

  var onMouseUp = function (upEvt) {
    pinMovedOff();
    window.renderCatalog();
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    priceFilter.rangeFilter.addEventListener('click', onRangeFilterClick);
    priceFilter.rangeFilter.addEventListener('mouseleave', pinMovedOff);
  };

  var onFilterPinMouseDown = function (evt) {
    evt.preventDefault();
    priceFilter.startX = evt.clientX;
    priceFilter.pinEvt = evt;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  PriceFilter.prototype._create = function () {
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
    this.updateFilter = function () {
    };
    this.filtrate = function (good) {
      return (good.price >= priceFilter.filterMin) && (good.price <= priceFilter.filterMax);
    };
  };

  PriceFilter.prototype.resetFilter = function () {
    this.rangeFilter.addEventListener('click', onRangeFilterClick);
    this.pinRight.addEventListener('mousedown', onFilterPinMouseDown);
    this.pinLeft.addEventListener('mousedown', onFilterPinMouseDown);
    this.pinMoved = false;
    document.querySelector('.range__prices .range__price--min').textContent = window.MIN_PRICE;
    document.querySelector('.range__prices .range__price--max').textContent = window.MAX_PRICE;
    this.filterMin = window.MIN_PRICE;
    this.filterMax = window.MAX_PRICE;
    changePinPosition(this.pinLeft, this.calcFilterPosition(this.filterMin) - this.pinWidth / 2);
    changePinPosition(this.pinRight, this.calcFilterPosition(this.filterMax));
    this.lineUpdate();
  };
  PriceFilter.prototype.calcFilterValue = function (pos) {
    pos += this.pinWidth / 2;
    return Math.round((window.TOTAL_MAX_PRICE * pos) / this.rangeFilter.clientWidth);
  };
  PriceFilter.prototype.calcFilterPosition = function (value) {
    return Math.round((this.maxX * value) / window.TOTAL_MAX_PRICE);
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

  PriceFilter.prototype.updateValue = function () {
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
    this.updateValue();
  };

  PriceFilter.prototype.calcPin = function (X) {
    X -= this.rangeFilter.offsetLeft;
    var filterValue = this.calcFilterValue(X);
    if (X < this.minX + ((this.maxX - this.minX) / 2)) {
      changePinPosition(this.pinLeft, X - 0.5 * this.pinWidth, this.minX, this.pinRight.offsetLeft);
      this.filterMin = filterValue;
    } else {
      changePinPosition(this.pinRight, X - 0.5 * this.pinWidth, this.pinLeft.offsetLeft, this.maxX);
      this.filterMax = filterValue;
    }
    pinMovedOff();
    this.lineUpdate();
    window.renderCatalog();
  };

  window.filterList = [];

  var priceFilter = new PriceFilter();

  window.filterList = [
    priceFilter,
    new TypeFilter('food-type'),
    new TypeFilter('food-property')
    // new TypeFilter('mark'),
    // new TypeFilter('sort'),
    // new TypeFilter('food-type')
  ];

  window.resetFilters = function () {
    window.filterList.forEach(function (filter) {
      filter.resetFilter();
    });
  };
  window.updateFilters = function () {
    window.filterList.forEach(function (filter) {
      filter.updateFilter();
    });
  };

  document.querySelector('.catalog__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    window.resetFilters();
    window.renderCatalog();
  });

  document.querySelectorAll('.catalog__filter > li > input').forEach(function (element) {
    element.addEventListener('change', function () {
      window.updateFilters();
      window.renderCatalog();
    });
  });

})();
