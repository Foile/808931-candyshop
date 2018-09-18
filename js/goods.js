'use strict';
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var IMAGES = ['img/cards/ice-garlic.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-pig.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-italian.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-cedar.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-chile.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-russian.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-spicy.jpg'];
var CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var STARS_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
var GOODS_COUNT = 26;
var BASKET_COUNT = 3;

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

var setHidden = function (element, hide) {
  if (!hide) {
    element.classList.remove('visually-hidden');
  } else {
    element.classList.add('visually-hidden');
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
  price.appendChild(newElement('span', 'card__weight', '/ ' + good.weight + ' Г'));

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
  card.querySelector('.card__btn-composition').onclick = function () {
    if (card.querySelector('.card__composition--hidden')) {
      card.querySelector('.card__composition').classList.remove('card__composition--hidden');
    } else {
      card.querySelector('.card__composition').classList.add('card__composition--hidden');
    }
  };
  return card;
};

var renderCardOrder = function (template, good) {
  var card = template.cloneNode(true);
  card.querySelector('.card-order__title').textContent = good.name;
  card.querySelector('.card-order__price').textContent = good.price + ' ₽';
  var img = card.querySelector('.card-order__img');
  img.src = good.picture;
  img.alt = good.name;
  card.querySelector('.card-order__count').value = good.amount;
  return card;
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

var catalog = document.querySelector('.catalog__cards');
catalog.classList.remove('catalog__cards--load');
setHidden(document.querySelector('.catalog__load'), true);

var cardTemplate = document.querySelector('#card')
  .content.querySelector('.catalog__card');

var goods = generateRandomGoods(GOODS_COUNT);

var fragment = document.createDocumentFragment();
goods.forEach(function (good) {
  fragment.appendChild(renderCard(cardTemplate, good));
});

catalog.appendChild(fragment);

var basketGoods = getRandomArray(goods, BASKET_COUNT);
var basket = document.querySelector('.goods__cards');
basket.classList.remove('goods__cards--empty');

setHidden(document.querySelector('.goods__card-empty'), true);

var basketTemplate = document.querySelector('#card-order')
  .content.querySelector('.goods_card');

var fragmentBasket = document.createDocumentFragment();
basketGoods.forEach(function (good) {
  fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
});

basket.appendChild(fragmentBasket);

var cardInput = document.getElementById('payment__card-number');
cardInput.addEventListener('blur', function () {
  cardInput.valid = checkCardNumber(cardInput.value);
  document.querySelector('.payment__card-wrap .payment__card-status').textContent = cardInput.valid ? 'Одобрен' : 'Неизвестен';
});
