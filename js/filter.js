'use strict';
(function () {
  var Filter = function () {
    this._create();
  };
  Filter.prototype._create = function () {
    this.active = false;
    this.matches = 0;
    this.filtrate = function () {
      return true;
    };
    this.resetFilter = function () {
    };
    this.updateFilter = function () {
    };
  };

  var getTypeFilterValue = function (control) {
    return control.parentNode.querySelector('label').textContent;
  };
  var TypeFilter = function (name) {
    Filter.apply(this, arguments);
    this.name = name;
    this.active = false;
    this.filterElementsSelector = function (elName) {
      return '.catalog__filter > li > input[name^="' + elName + '"]';
    };
    this.isMatch = function (good, filter) {
      return good.kind === getTypeFilterValue(filter);
    };

    this.resetFilter = function () {
      document.querySelectorAll(this.filterElementsSelector(this.name)).forEach(function (element) {
        element.checked = false;
      });
    };

    this.updateFilter = function () {
      this.active = (document.querySelector(this.filterElementsSelector(this.name) + ':checked') && true);
    };

    this.filtrate = function (good) {
      var match = !this.active;
      document.querySelectorAll(this.filterElementsSelector(this.name) + ':checked').forEach(function (filter) {
        match = match || this.isMatch(good, filter);
      }, this);
      return match;
    };
  };

  TypeFilter.prototype = Object.create(Filter.prototype);

  var PropertyFilter = function () {
    TypeFilter.apply(this, arguments);
    this.name = 'food-property';
    this.isMatch = function (good, filter) {
      var fact = filter.value;
      var match = true;
      switch (fact) {
        case 'gluten-free': match = !good.nutritionFacts.gluten; break;
        case 'sugar-free': match = !good.nutritionFacts.sugar; break;
        case 'vegetarian': match = good.nutritionFacts.vegetarian; break;
      }
      return match;
    };
    this.filtrate = function (good) {
      var match = true;
      var filterFacts = [];
      document.querySelectorAll(this.filterElementsSelector(this.name) + ':checked').forEach(function (filter) {
        filterFacts.push(filter);
      });
      filterFacts.forEach(function (filter) {
        match = match && this.isMatch(good, filter);
      }, this);
      return match;
    };
  };

  PropertyFilter.prototype = Object.create(TypeFilter.prototype);

  var MarkFilter = function () {
    TypeFilter.apply(this, arguments);
    this.name = 'mark';
    this.isMatch = function (good, filter) {
      var mark = filter.value;
      var match = true;
      switch (mark) {
        case 'favorite': match = match && good.isFavorite; break;
        case 'availability': match = match && good.inStock; break;
      }
      return match;
    };
    this.filtrate = function (good) {
      var match = true;
      document.querySelectorAll(this.filterElementsSelector(this.name) + ':checked').forEach(function (filter) {
        match = match && this.isMatch(good, filter);
      }, this);
      return match;
    };
  };

  MarkFilter.prototype = Object.create(TypeFilter.prototype);


  var PriceFilter = function () {
    Filter.apply(this, arguments);
    this.name = 'price';
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
    this.filterElementsSelector = function () {
      return '.range__prices';
    };
    this.isMatch = function (good) {
      return (good.price >= priceFilter.filterMin) && (good.price <= priceFilter.filterMax);
    };
    this.filtrate = function (good) {
      return this.isMatch(good);
    };
    this.resetFilter = function () {
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
    new PropertyFilter('food-property'),
    new MarkFilter('mark')
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

  var updateFilterMatchesCountElement = function (element, count) {
    element.parentNode.querySelector('span').textContent = '(' + count + ')';
  };

  window.filterRenderStat = function () {
    window.filterList.forEach(function (filter) {
      if (filter.name === 'price') {
        return;
      }
      document.querySelectorAll(filter.filterElementsSelector(filter.name)).forEach(function (element) {
        filter.matches = 0;
        window.goods.forEach(function (good) {
          filter.matches += (filter.isMatch(good, element) ? 1 : 0);
        });
        updateFilterMatchesCountElement(element, filter.matches);
      });
    });
  };

})();
