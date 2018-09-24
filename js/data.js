'use strict';
(function () {
  var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
  var IMAGES = ['img/cards/ice-garlic.jpg', 'img/cards/ice-cucumber.jpg', 'img/cards/ice-pig.jpg', 'img/cards/ice-mushroom.jpg', 'img/cards/ice-eggplant.jpg', 'img/cards/ice-italian.jpg', 'img/cards/gum-wasabi.jpg', 'img/cards/gum-eggplant.jpg', 'img/cards/gum-mustard.jpg', 'img/cards/gum-cedar.jpg', 'img/cards/gum-portwine.jpg', 'img/cards/gum-chile.jpg', 'img/cards/soda-bacon.jpg', 'img/cards/soda-peanut-grapes.jpg', 'img/cards/soda-celery.jpg', 'img/cards/soda-cob.jpg', 'img/cards/soda-garlic.jpg', 'img/cards/soda-russian.jpg', 'img/cards/marmalade-sour.jpg', 'img/cards/marmalade-corn.jpg', 'img/cards/marmalade-caviar.jpg', 'img/cards/marmalade-new-year.jpg', 'img/cards/marmalade-beer.jpg', 'img/cards/marshmallow-shrimp.jpg', 'img/cards/marshmallow-bacon.jpg', 'img/cards/marshmallow-wine.jpg', 'img/cards/marshmallow-beer.jpg', 'img/cards/marshmallow-spicy.jpg'];
  var CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

  window.generateRandomGoods = function (count) {
    var goods = [];
    var names = GOODS_NAMES.slice(0);
    var images = IMAGES.slice(0);
    for (var i = 0; i < count && names.length > 0; i++) {
      var newGood = {};
      var goodID = window.getRandomNumber(0, names.length - 1);
      newGood.name = names[goodID];
      newGood.picture = images[goodID];
      names.splice(goodID, 1);
      images.splice(goodID, 1);
      newGood.amount = window.getRandomNumber(0, 20);
      newGood.price = window.getRandomNumber(100, 1500);
      if (newGood.price < window.MIN_PRICE) {
        window.MIN_PRICE = newGood.price;
      }
      if (newGood.price > window.MAX_PRICE) {
        window.MAX_PRICE = newGood.price;
      }
      newGood.weight = window.getRandomNumber(30, 300);

      var rating = {};
      rating.value = window.getRandomNumber(1, 5);
      rating.number = window.getRandomNumber(10, 900);
      newGood.rating = rating;

      var nutritionFacts = {};
      nutritionFacts.sugar = window.getRandomNumber(0, 100) < 50;
      nutritionFacts.energy = window.getRandomNumber(70, 500);

      nutritionFacts.contents = (window.getRandomArray(CONTENTS, window.getRandomNumber(1, CONTENTS.length))).join(', ');
      newGood.nutritionFacts = nutritionFacts;
      goods.push(newGood);
    }
    return goods;
  };

})();
