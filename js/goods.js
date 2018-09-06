'use strict';
var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var IMAGES = ['img/cards/gum-cedar.jpg', 'img/cards/gum-chile.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-garlic.jpg', 'img/cards/ice-italian.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-pig.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-spicy.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-russian.jpg'];
var CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var STARS_CLASSES = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
var GOODS_COUNT = 26;
var BASKET_COUNT = 3;

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};
var getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

var generateRandomGoods = function (count) {
  var goods = [];
  for (var i = 0; i < count; i++) {
    var newGood = {};
    newGood.name = getRandomElement(GOODS_NAMES);
    newGood.picture = getRandomElement(IMAGES);
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

    var contents = '';

    var contentCount = 0;
    CONTENTS.forEach(function (content) {

      if (getRandomNumber(0, 100) < 50) {
        contents += content; contentCount++;
      }
    });

    if (contentCount === 0) {
      contents += getRandomElement(CONTENTS);
    }

    nutritionFacts.contents = contents;
    newGood.nutritionFacts = nutritionFacts;
    goods.push(newGood);
  }
  return goods;

};

var renderCard = function (template, good) {
  var card = template.cloneNode(true);
  card.querySelector('.card__title').textContent = good.name;
  card.querySelector('.card__price').innerHTML = good.price + '<span class="card__currency">₽</span><span class="card__weight">/ ' + good.weight + ' Г</span>;';
  var img = card.querySelector('.card__img');
  img.src = good.picture;
  img.alt = good.name;
  card.querySelector('.card__composition-list').textContent = good.contents;
  if (good.amount > 5) {
    card.classList.add('card--in-stock');
  } else {
    if (good.amount <= 0) {
      card.classList.add('card--soon');
    } else {
      card.classList.add('card--little');
    }
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

  return card;
};

var renderCardOrder = function (template, good) {
  var card = template.cloneNode(true);
  card.querySelector('.card-order__title').textContent = good.name;
  card.querySelector('.card-order__price').innerHTML = good.price + ' ₽';// '<span class="card__currency">₽</span><span class="card__weight">/ ' + good.weight + ' Г</span>;';
  var img = card.querySelector('.card-order__img');
  img.src = good.picture;
  img.alt = good.name;
  card.querySelector('.card-order__count').value = good.amount;
  return card;
};

var catalog = document.querySelector('.catalog__cards');
catalog.classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');

var goods = generateRandomGoods(GOODS_COUNT);

var fragment = document.createDocumentFragment();
goods.forEach(function (good) {
  fragment.appendChild(renderCard(cardTemplate, good));
});

catalog.appendChild(fragment);

var basketGoods = generateRandomGoods(BASKET_COUNT);
var basket = document.querySelector('.goods__cards');
basket.classList.remove('goods__cards--empty');
document.querySelector('.goods__card-empty').classList.add('visually-hidden');

var basketTemplate = document.querySelector('#card-order')
  .content
  .querySelector('.goods_card');

var fragmentBasket = document.createDocumentFragment();
basketGoods.forEach(function (good) {
  fragmentBasket.appendChild(renderCardOrder(basketTemplate, good));
});

basket.appendChild(fragmentBasket);
