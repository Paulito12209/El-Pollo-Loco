const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
  [
    new Cloud("../img/5_background/layers/4_clouds/1.png", 0),
    new Cloud("../img/5_background/layers/4_clouds/2.png", 720)
  ],
  [
    // x = -720
    new BackgroundObject("../img/5_background/layers/air.png", -720),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/2.png",
      -720
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      -720
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/2.png",
      -720
    ),
    // X = 0
    new BackgroundObject("../img/5_background/layers/air.png", 0),
    new BackgroundObject("../img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/air.png", 720),
    new BackgroundObject("../img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      720
    ),
    new BackgroundObject("../img/5_background/layers/1_first_layer/2.png", 720),
    // x = 720 * 2
    new BackgroundObject("../img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/1.png",
      720 * 2
    ),
    // x = 720 * 3
    new BackgroundObject("../img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/2.png",
      720 * 3
    )
  ],
  [
    new Coin(300, 180),
    new Coin(350, 150),

    new Coin(400, 150),
    new Coin(450, 200),

    new Coin(500, 180),
    new Coin(550, 200),

    new Coin(600, 220),
    new Coin(650, 200),

    new Coin(700, 150),
    new Coin(750, 200),

    new Coin(800, 180),
    new Coin(850, 160),

    new Coin(900, 200),
    new Coin(950, 180)
  ],
  [
    new Bottle(350, 360),
    new Bottle(550, 360),
    new Bottle(800, 360),
    new Bottle(1100, 360)
  ]
);
