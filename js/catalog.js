'use strict';
(function () {
  var STARS_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];

  var renderCard = function (template, good) {
    var card = template.cloneNode(true);
    card.querySelector('.card__title').textContent = good.name;
    var price = card.querySelector('.card__price');
    price.textContent = '';
    price.appendChild(window.utils.newElement('span', undefined, good.price));
    price.appendChild(window.utils.newElement('span', 'card__currency', '₽'));
    price.appendChild(window.utils.newElement('span', 'card__weight', '/ ' + good.weight + ' г' + ' / ' + good.amount + ' шт'));
    var img = card.querySelector('.card__img');
    img.src = window.utils.picturePath + good.picture;
    img.alt = good.name;
    if (good.amount > 5) {
      card.classList.add('card--in-stock');
    }
    if (good.amount <= 0) {
      card.classList.add('card--soon');
    }
    if (good.inStock && good.amount <= 5) {
      card.classList.add('card--little');
    }
    var stars = card.querySelector('.stars__rating');
    stars.classList.forEach(function (starsClass) {
      if (STARS_CLASSES.indexOf(starsClass) >= 0) {
        stars.classList.remove(starsClass);
      }
    });
    stars.classList.add(STARS_CLASSES[good.rating.value - 1]);
    card.querySelector('.star__count').textContent = good.rating.number;
    card.querySelector('.card__characteristic').textContent = (good.nutritionFacts.sugar ? 'Содержит сахар. ' : 'Без сахара. ') + good.nutritionFacts.energy + ' ккал';
    card.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;
    card.querySelector('.card__btn-composition').addEventListener('click', function () {
      if (card.querySelector('.card__composition--hidden')) {
        card.querySelector('.card__composition').classList.remove('card__composition--hidden');
      } else {
        card.querySelector('.card__composition').classList.add('card__composition--hidden');
      }
    });

    var favoriteButton = card.querySelector('.card__btn-favorite');
    window.utils.toggleClass(favoriteButton, good.isFavorite, 'card__btn-favorite--selected');

    favoriteButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      good.isFavorite = !good.isFavorite;
      window.utils.toggleClass(favoriteButton, good.isFavorite, 'card__btn-favorite--selected');
      window.filter.renderStat('mark');
    });

    var addToCartButton = card.querySelector('.card__btn');
    if (good.amount > 0) {
      addToCartButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        good.amount += -1;
        window.basket.add(good);
        window.catalog.render();
        window.basket.render();
      });
    }
    return card;
  };

  var cardTemplate = document.querySelector('#card')
    .content.querySelector('.catalog__card');
  var emptyFiltersTemplate = document.querySelector('#empty-filters')
    .content.querySelector('.catalog__empty-filter');

  var renderCatalogBase = function () {
    var catalog = document.querySelector('.catalog__cards');
    catalog.querySelectorAll('.catalog__card').forEach(function (child) {
      catalog.removeChild(child);
    });

    catalog.classList.remove('catalog__cards--load');
    window.utils.toggleClass(document.querySelector('.catalog__load'), true, 'visually-hidden');
    var fragment = document.createDocumentFragment();
    var visibleGoods = window.catalog.goods.filter(function (good) {
      var visilbe = true;
      window.filter.filterList.forEach(function (filter) {
        visilbe = visilbe && filter.filtrate(good);
      });
      return visilbe;
    });
    visibleGoods.sort(function (good1, good2) {
      return window.filter.sorting.sort(good1, good2);
    });
    visibleGoods.forEach(function (good) {
      fragment.appendChild(renderCard(cardTemplate, good));
    });
    var child = catalog.querySelector('.catalog__empty-filter');
    if (child !== null) {
      catalog.removeChild(child);
    }
    if (visibleGoods.length === 0) {
      var emptyFilter = emptyFiltersTemplate.cloneNode(true);
      emptyFilter.querySelector('.catalog__show-all').addEventListener('click', window.filter.onFilterResetAll);
      catalog.appendChild(emptyFilter);
    }

    catalog.appendChild(fragment);
  };

  window.catalog = {
    goods: [],
    render: window.debounce(renderCatalogBase)
  };

})();
