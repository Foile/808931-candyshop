'use strict';
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var IMAGES = ['img/cards/ice-garlic.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-pig.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-italian.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-cedar.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-chile.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-russian.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-spicy.jpg'];
var CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var STARS_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
var GOODS_COUNT = 26;
var MAX_PRICE = 0;
var TOTAL_MAX_PRICE = 1500;
var MIN_PRICE = TOTAL_MAX_PRICE;
var getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

var getRandomArray = function (array, count) {
  var sourceArray = array.slice(0);
  var resultArray = [];
  if (!count) {
    count = getRandomNumber(1, array.length);
  }

  for (var i = 0; (i < count && sourceArray.length > 0); i++) {
    var index = getRandomNumber(0, sourceArray.length);
    resultArray.push(sourceArray[index]);
    sourceArray.splice(index, 1);
  }
  return resultArray;
};

var newElement = function (type, cls, txt) {
  var el = document.createElement(type);
  el.classList.add(cls);
  el.textContent = txt;
  return el;
};

var toggleClass = function (element, add, name) {
  if (!add) {
    element.classList.remove(name);
  } else {
    element.classList.add(name);
  }
};

var generateRandomGoods = function (count) {
  var goods = [];
  var names = GOODS_NAMES.slice(0);
  var images = IMAGES.slice(0);
  for (var i = 0; i < count && names.length > 0; i++) {
    var newGood = {};
    var goodID = getRandomNumber(0, names.length - 1);
    newGood.name = names[goodID];
    newGood.picture = images[goodID];
    names.splice(goodID, 1);
    images.splice(goodID, 1);
    newGood.amount = getRandomNumber(0, 20);
    newGood.price = getRandomNumber(100, 1500);
    if (newGood.price < MIN_PRICE) {
      MIN_PRICE = newGood.price;
    }
    if (newGood.price > MAX_PRICE) {
      MAX_PRICE = newGood.price;
    }
    newGood.weight = getRandomNumber(30, 300);

    var rating = {};
    rating.value = getRandomNumber(1, 5);
    rating.number = getRandomNumber(10, 900);
    newGood.rating = rating;

    var nutritionFacts = {};
    nutritionFacts.sugar = getRandomNumber(0, 100) < 50;
    nutritionFacts.energy = getRandomNumber(70, 500);

    nutritionFacts.contents = (getRandomArray(CONTENTS, getRandomNumber(1, CONTENTS.length))).join(', ');
    newGood.nutritionFacts = nutritionFacts;
    goods.push(newGood);
  }
  return goods;
};

var renderCard = function (template, good) {

  var card = template.cloneNode(true);
  card.querySelector('.card__title').textContent = good.name;

  var price = card.querySelector('.card__price');
  price.textContent = '';
  price.appendChild(newElement('span', undefined, good.price));
  price.appendChild(newElement('span', 'card__currency', '₽'));
  price.appendChild(newElement('span', 'card__weight', '/ ' + good.weight + ' г' + ' / ' + good.amount + ' шт'));

  var img = card.querySelector('.card__img');
  img.src = good.picture;
  img.alt = good.name;

  if (good.amount > 5) {
    card.classList.add('card--in-stock');
  }

  if (good.amount <= 0) {
    card.classList.add('card--soon');
  }

  if (good.amount > 0 && good.amount <= 5) {
    card.classList.add('card--little');
  }

  var stars = card.querySelector('.stars__rating');
  stars.classList.forEach(function (starsClass) {
    if (STARS_CLASSES.indexOf(starsClass) >= 0) {
      stars.classList.remove(starsClass);
    }
  }
  );
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
  favoriteButton.addEventListener('click', function () {
    if (favoriteButton.querySelector('.card__btn-favorite--selected')) {
      favoriteButton.classList.remove('card__btn-favorite--selected');
    } else {
      favoriteButton.classList.add('card__btn-favorite--selected');
    }
  });

  var addToCartButton = card.querySelector('.card__btn');
  if (good.amount > 0) {
    addToCartButton.addEventListener('click', function () {
      good.amount += -1;
      if (basketGoods.indexOf(good) >= 0) {
        basketGoods[basketGoods.indexOf(good)].count += 1;
      } else {
        basketGoods.push(good);
        basketGoods[basketGoods.indexOf(good)].count = 1;
      }
      renderCatalog();
      renderBasket();
    });
  }
  return card;
};

var removeGoodFromBasket = function (g) {
  basketGoods.splice(basketGoods.indexOf(g), 1);
  renderBasket();
};

var renderCardOrder = function (template, good) {
  if (good.count === 0) {
    removeGoodFromBasket(good);
  }
  var card = template.cloneNode(true);
  card.querySelector('.card-order__title').textContent = good.name;
  card.querySelector('.card-order__price').textContent = good.price + ' ₽';
  var img = card.querySelector('.card-order__img');
  img.src = good.picture;
  img.alt = good.name;
  card.querySelector('.card-order__count').value = good.count;

  card.querySelector('.card-order__btn--decrease').addEventListener('click', function () {
    good.count += -1;
    goods[goods.indexOf(good)].amount += 1;
    card.querySelector('.card-order__count').value = good.count;
    if (good.count === 0) {
      removeGoodFromBasket(good);
    }
    if (good.amount > 0) {
      renderBasket();
    }
    renderCatalog();
  });
  if (goods[goods.indexOf(good)].amount > 0) {
    card.querySelector('.card-order__btn--increase').addEventListener('click', function () {
      good.count += 1;
      goods[goods.indexOf(good)].amount += -1;
      renderCatalog();
      card.querySelector('.card-order__count').value = good.count;
      if (good.amount <= 0) {
        renderBasket();
      }
    });
  }

  card.querySelector('.card-order__close').addEventListener('click', function () {
    removeGoodFromBasket(good);
    goods[goods.indexOf(good)].amount += good.count;
    renderCatalog();
  });
  return card;
};

var togglePayForm = function (form, enable) {
  form.querySelectorAll('input').forEach(function (input) {
    input.removeAttribute('disabled');
    if (!enable) {
      input.setAttribute('disabled', undefined);
    }
  });

  form.querySelectorAll('fieldset').forEach(function (input) {
    input.removeAttribute('disabled');
    if (!enable) {
      input.setAttribute('disabled', undefined);
    }
  });
};

var renderCatalog = function () {
  var catalog = document.querySelector('.catalog__cards');
  catalog.querySelectorAll('.catalog__card').forEach(function (child) {
    catalog.removeChild(child);
  });

  catalog.classList.remove('catalog__cards--load');
  toggleClass(document.querySelector('.catalog__load'), true, 'visually-hidden');
  var fragment = document.createDocumentFragment();
  var visibleGoods = goods.filter(function (good) {
    return (good.price >= filterMinPrice) && (good.price <= filterMaxPrice);
  });
  visibleGoods.forEach(function (good) {
    fragment.appendChild(renderCard(cardTemplate, goods[goods.indexOf(good)]));
  });

  catalog.appendChild(fragment);
};

var renderBasket = function () {
  var basket = document.querySelector('.goods__cards');

  basket.querySelectorAll('.goods_card').forEach(function (child) {
    basket.removeChild(child);
  });
  var form = document.querySelector('.buy form');
  if (basketGoods.length > 0) {
    basket.classList.remove('goods__cards--empty');
    togglePayForm(form, true);
  } else {
    togglePayForm(form, false);
  }

  toggleClass(document.querySelector('.goods__card-empty'), (basketGoods.length > 0), 'visually-hidden');
  goodsInBasket = 0;
  var fragmentBasket = document.createDocumentFragment();
  basketGoods.forEach(function (good) {
    goodsInBasket += good.count;
    fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
  });
  basket.appendChild(fragmentBasket);
  document.querySelector('.main-header__basket').textContent = (goodsInBasket > 0) ? goodsInBasket : 'В корзине ничего нет';
};

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

var calcFilterValue = function (pos) {
  pos += pinWidth / 2;
  return Math.round((TOTAL_MAX_PRICE * pos) / rangeFilter.clientWidth);
};

var calcFilterPosition = function (value) {
  return Math.round(maxX * value / TOTAL_MAX_PRICE);
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

var goods = generateRandomGoods(GOODS_COUNT);
var goodsInBasket;
var filterMinPrice = MIN_PRICE;
var filterMaxPrice = MAX_PRICE;
var rangeFilter = document.querySelector('.range__filter');
var priceRangeFilterLeft = rangeFilter.querySelector('.range__btn--left');
var priceRangeFilterRight = rangeFilter.querySelector('.range__btn--right');
var priceRangeFilterLine = rangeFilter.querySelector('.range__fill-line');
var pinWidth = priceRangeFilterRight.clientWidth;

var priceFilterLineUpdate = function () {
  var left = priceRangeFilterLeft.offsetLeft;
  var right = priceRangeFilterRight.offsetLeft
  if (left > right) {
    right = priceRangeFilterLeft.offsetLeft;
    left = priceRangeFilterRight.offsetLeft;
  }
  filterMinPrice = calcFilterValue(left);
  filterMaxPrice = calcFilterValue(right);
  priceRangeFilterLine.style.right = (maxX - right) + 'px';
  priceRangeFilterLine.style.left = (left + pinWidth / 2) + 'px';
  updatePriceFilter();
};

var initPriceFilter = function () {
  document.querySelector('.range__prices .range__price--min').textContent = MIN_PRICE;
  document.querySelector('.range__prices .range__price--max').textContent = MAX_PRICE;
  filterMinPrice = MIN_PRICE;
  filterMaxPrice = MAX_PRICE;
  changePinPosition(priceRangeFilterLeft, calcFilterPosition(filterMinPrice));
  changePinPosition(priceRangeFilterRight, calcFilterPosition(filterMaxPrice));
  priceFilterLineUpdate();
};

var updatePriceFilter = function () {
  document.querySelector('.range__prices .range__price--min').textContent = filterMinPrice;
  document.querySelector('.range__prices .range__price--max').textContent = filterMaxPrice;
};

initPriceFilter();

var minX = rangeFilter.clientLeft - priceRangeFilterRight.clientWidth / 2;
var maxX = rangeFilter.clientLeft + rangeFilter.clientWidth - priceRangeFilterRight.clientWidth / 2;

var onRangeFilterClick = function (evt) {
  evt.preventDefault();
  var X = evt.clientX;
  var filterValue = calcFilterValue(X);
  if (X < minX + ((maxX - minX) / 2)) {
    changePinPosition(priceRangeFilterLeft, X - pinWidth, minX, priceRangeFilterRight.offsetLeft);
    filterMinPrice = filterValue;
  } else {
    changePinPosition(priceRangeFilterRight, X - pinWidth, priceRangeFilterLeft.offsetLeft, maxX);
    filterMaxPrice = filterValue;
  }
  priceFilterLineUpdate();
};

var onFilterPinMouseDown = function (evt) {
  evt.preventDefault();
  var startX = evt.clientX;
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = startX - moveEvt.clientX;
    startX = moveEvt.clientX;
    changePinPosition(evt.target, evt.target.offsetLeft - shift, minX, maxX);
    priceFilterLineUpdate();
    rangeFilter.removeEventListener('click', onRangeFilterClick);
  };
  var onMouseUp = function (upEvt) {
    renderCatalog();
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    rangeFilter.addEventListener('click', onRangeFilterClick);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

rangeFilter.addEventListener('click', onRangeFilterClick);
priceRangeFilterRight.addEventListener('mousedown', onFilterPinMouseDown);
priceRangeFilterLeft.addEventListener('mousedown', onFilterPinMouseDown);

document.querySelector('.catalog__submit').addEventListener('click', function (evt) {
  evt.preventDefault();
  initPriceFilter();
  renderCatalog();
});

var basketGoods = [];

var cardTemplate = document.querySelector('#card')
  .content.querySelector('.catalog__card');

var basketTemplate = document.querySelector('#card-order')
  .content.querySelector('.goods_card');

renderCatalog();

var paymentType = document.querySelector('.payment__method');
paymentType.addEventListener('click', function () {
  toggleClass(document.querySelector('.payment__card-wrap'), !document.querySelector('#payment__card').checked, 'visually-hidden');
  toggleClass(document.querySelector('.payment__cash-wrap'), !document.querySelector('#payment__cash').checked, 'visually-hidden');
});

var deliverType = document.querySelector('.deliver__toggle');
deliverType.addEventListener('click', function () {
  toggleClass(document.querySelector('.deliver__store'), !document.querySelector('#deliver__store').checked, 'visually-hidden');
  toggleClass(document.querySelector('.deliver__courier'), !document.querySelector('#deliver__courier').checked, 'visually-hidden');
});


var cardInput = document.querySelector('#payment__card-number');
cardInput.addEventListener('blur', function () {
  cardInput.valid = checkCardNumber(cardInput.value);
  document.querySelector('.payment__card-wrap .payment__card-status').textContent = cardInput.valid ? 'Одобрен' : 'Неизвестен';
});
