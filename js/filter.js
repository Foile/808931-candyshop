'use strict';
(function () {
  var Filter = function () {
    this._create();
  };
  Filter.prototype._create = function () {
    this.filtersToReset = [];
    this.active = false;
    this.matches = 0;
    this.isMatch = function () {
      return true;
    };
    this.filtrate = function (good) {
      return this.isMatch(good);
    };
    this.resetFilter = function () {
      this.active = false;
    };
    this.updateFilter = function () {
    };
    this.filterElementsSelector = function () {
      return '';
    };
    this.getFilterStat = function () {
      var element = document.querySelector(this.filterElementsSelector(this.name));
      this.matches = 0;
      window.catalog.goods.forEach(function (good) {
        this.matches += (this.isMatch(good, element) ? 1 : 0);
      }, this);
      element.parentNode.querySelector('.range__price-count > span').textContent = '(' + this.matches + ')';
    };
  };

  var getTypeFilterValue = function (control) {
    return control.parentNode.querySelector('label').textContent;
  };
  var updateFilterMatchesCountElement = function (element, count) {
    element.parentNode.querySelector('span').textContent = '(' + count + ')';
  };

  var TypeFilter = function (name) {
    Filter.apply(this, arguments);
    this.name = name;
    this.active = false;
    this.filtersToReset = ['mark'];
    this.filterElementsSelector = function (elName) {
      return '.catalog__filter > li > input[name^="' + elName + '"]';
    };
    this.isMatch = function (good, filter) {
      return good.kind === getTypeFilterValue(filter);
    };

    this.resetFilter = function () {
      this.active = false;
      document.querySelectorAll(this.filterElementsSelector(this.name)).forEach(function (element) {
        element.checked = false;
      });
    };

    this.updateFilter = function () {
      this.active = (document.querySelector(this.filterElementsSelector(this.name) + ':checked') && true);
      if (this.active && (this.filtersToReset.length > 0)) {
        window.filter.filterList.forEach(function (filterToReset) {
          this.filtersToReset.forEach(function (resetName) {
            if ((resetName === 'all' && filterToReset.name !== this.name) || (filterToReset.name === resetName)) {
              filterToReset.resetFilter();
            }
          }, this);
        }, this);
      }
    };

    this.filtrate = function (good) {
      var match = !this.active;
      document.querySelectorAll(this.filterElementsSelector(this.name) + ':checked').forEach(function (filter) {
        match = match || this.isMatch(good, filter);
      }, this);
      return match;
    };
    this.getFilterStat = function () {
      document.querySelectorAll(this.filterElementsSelector(this.name)).forEach(function (element) {
        this.matches = 0;
        window.catalog.goods.forEach(function (good) {
          this.matches += (this.isMatch(good, element) ? 1 : 0);
        }, this);
        updateFilterMatchesCountElement(element, this.matches);
      }, this);
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
    this.filtersToReset = ['all'];
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
    this.filterMin = window.utils.limits.MIN_PRICE;
    this.filterMax = window.utils.limits.MAX_PRICE;
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
    this.resetFilter = function () {
      this.rangeFilter.addEventListener('click', onRangeFilterClick);
      this.pinRight.addEventListener('mousedown', onFilterPinMouseDown);
      this.pinLeft.addEventListener('mousedown', onFilterPinMouseDown);
      this.pinMoved = false;
      document.querySelector('.range__prices .range__price--min').textContent = window.utils.limits.MIN_PRICE;
      document.querySelector('.range__prices .range__price--max').textContent = window.utils.limits.MAX_PRICE;
      this.filterMin = window.utils.limits.MIN_PRICE;
      this.filterMax = window.utils.limits.MAX_PRICE;
      changePinPosition(this.pinLeft, this.calcFilterPosition(this.filterMin) - this.pinWidth / 2);
      changePinPosition(this.pinRight, this.calcFilterPosition(this.filterMax));
      this.lineUpdate();
    };

    this.calcFilterPosition = function (value) {
      return Math.round((this.maxX * value) / window.utils.limits.TOTAL_MAX_PRICE);
    };

    this.updateValue = function () {
      document.querySelector('.range__prices .range__price--min').textContent = this.filterMin;
      document.querySelector('.range__prices .range__price--max').textContent = this.filterMax;
      this.getFilterStat();
    };
    this.lineUpdate = function () {
      var left = this.pinLeft.offsetLeft;
      var right = this.pinRight.offsetLeft;
      this.filterMin = this.calcFilterValue(left);
      this.filterMax = this.calcFilterValue(right);
      this.filterLine.style.right = (this.maxX - right) + 'px';
      this.filterLine.style.left = (left + this.pinWidth / 2) + 'px';
      this.updateValue();
    };
    this.calcFilterValue = function (pos) {
      pos += this.pinWidth / 2;
      return Math.round((window.utils.limits.TOTAL_MAX_PRICE * pos) / this.rangeFilter.clientWidth);
    };

    this.calcPin = function (X) {
      X -= this.rangeFilter.offsetLeft;
      var filterValue = this.calcFilterValue(X);
      var middle = this.minX + ((this.maxX - this.minX) / 2);
      var left = this.pinLeft.offsetLeft;
      var right = this.pinRight.offsetLeft;
      if ((X < right && X < left) || (X < middle && left < middle && right < middle && X < right)
      ) {
        changePinPosition(this.pinLeft, X - 0.5 * this.pinWidth, this.minX, this.pinRight.offsetLeft);
        this.filterMin = filterValue;
      } else {
        changePinPosition(this.pinRight, X - 0.5 * this.pinWidth, this.pinLeft.offsetLeft, this.maxX);
        this.filterMax = filterValue;
      }
      pinMovedOff();
      this.lineUpdate();
      window.catalog.render();
    };
  };

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

  var changePinPosition = function (element, X, min, max) {
    if (X < min) {
      X = min;
    }
    if (X > max) {
      X = max;
    }
    element.style.left = X + 'px';
  };

  var onMouseMove = function (moveEvt) {
    priceFilter.pinMoved = true;
    moveEvt.preventDefault();
    var shift = priceFilter.startX - moveEvt.clientX;
    priceFilter.startX = moveEvt.clientX;
    var min = (priceFilter.pinEvt.target === priceFilter.pinLeft) ? priceFilter.minX : priceFilter.pinLeft.offsetLeft;
    var max = (priceFilter.pinEvt.target === priceFilter.pinRight) ? priceFilter.maxX : priceFilter.pinRight.offsetLeft;
    changePinPosition(priceFilter.pinEvt.target, priceFilter.pinEvt.target.offsetLeft - shift, min, max);
    priceFilter.lineUpdate();
    priceFilter.rangeFilter.removeEventListener('click', onRangeFilterClick);
  };

  var onMouseUp = function (upEvt) {
    window.catalog.render();
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

  PriceFilter.prototype = Object.create(Filter.prototype);

  var priceFilter = new PriceFilter();

  window.filter = {
    filterList: [
      priceFilter,
      new MarkFilter('mark'),
      new TypeFilter('food-type'),
      new PropertyFilter('food-property')
    ],
    resetAll: function () {
      window.filter.filterList.forEach(function (filter) {
        filter.resetFilter();
      });
    },
    updateAll: function () {
      window.filter.filterList.forEach(function (filter) {
        filter.updateFilter();
      });
    },
    onResetAll: function (evt) {
      evt.preventDefault();
      window.filter.resetAll();
      window.catalog.render();
    },
    renderStat: function (name) {
      if (name === undefined) {
        window.filter.filterList.forEach(function (filter) {
          filter.getFilterStat();
        });
        return;
      }

      var oneFilter = window.filter.filterList.find(function (filter) {
        return filter.name === name;
      });
      if (oneFilter) {
        oneFilter.getFilterStat();
      }
    },
    sorting: {
      name: 'sort',
      sort: function (good1, good2) {
        var res = this.getActiveSort(good1, good2);
        return res;
      },
      getActiveSort: function (good1, good2) {
        var activeSort = 'popular';
        var filter = document.querySelector('.catalog__filter > li > input[name^="' + this.name + '"]:checked');
        if (filter) {
          activeSort = filter.value;
        }
        return this.sortType[activeSort](good1, good2);
      },
      sortType: {
        popular: function () {
          return 0;
        },
        expensive: function (good1, good2) {
          return good2.price - good1.price;
        },
        cheep: function (good1, good2) {
          return good1.price - good2.price;
        },
        rating: function (good1, good2) {
          return (good2.rating.value * window.utils.limits.MAX_RATING_NUMBER + good2.rating.number) - (good1.rating.value * window.utils.limits.MAX_RATING_NUMBER + good1.rating.number);
        }
      }
    }
  };

  document.querySelector('.catalog__submit').addEventListener('click', window.filter.onResetAll);

  document.querySelectorAll('.catalog__filter > li > input').forEach(function (element) {
    element.addEventListener('change', function (evt) {
      if ((evt.target.name === 'mark') && evt.target.checked) {
        var otherElements = element.parentNode.parentNode.querySelectorAll('input[name="' + evt.target.name + '"]:checked');
        otherElements.forEach(function (el) {
          el.checked = el.value === evt.target.value;
        });
      }
      var oneFilter = window.filter.filterList.find(function (filter) {
        return filter.name === evt.target.name;
      });
      if (oneFilter) {
        oneFilter.updateFilter();
      }
      window.filter.updateAll();
      window.catalog.render();
    });
  });

})();
