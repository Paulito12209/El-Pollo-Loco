const level1 = new Level(
  [
    new Chicken(500),
    // new Chicken(650),
    // new Chicken(800),
    // new Chicken(950),
    // new Chicken(1100),
    // new Chicken(1250),
    // new Chicken(1400),
    // new Chicken(1550),
    // new Chicken(1700),
    // new Chicken(1850),
    // new Chicken(2000),
    // new Chicken(2150),
    // new Chicken(2300),
    // new Chicken(2450),
    // new Chicken(2600),
    // new Chicken(2750),
    // new Chicken(2900),
    // new Chicken(3150),
    // new Chicken(3300),
    new Endboss(1500) // Achtung: Lebensanzeige evtl. anpassen!
  ],
  [
    new Cloud("img/5_background/layers/4_clouds/1.png", 0),
    new Cloud("img/5_background/layers/4_clouds/2.png", 520),
    new Cloud("img/5_background/layers/4_clouds/2.png", 920),
    new Cloud("img/5_background/layers/4_clouds/1.png", 1320),
    new Cloud("img/5_background/layers/4_clouds/1.png", 1820),
    new Cloud("img/5_background/layers/4_clouds/2.png", 2220),
    new Cloud("img/5_background/layers/4_clouds/1.png", 2620),
    new Cloud("img/5_background/layers/4_clouds/1.png", 3020)
  ],
  [
    // x = -720
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      -720
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      -720
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      -720
    ),
    // X = 0
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720
    ),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),
    // x = 720 * 2
    new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 2
    ),
    // x = 720 * 3
    new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      720 * 3
    ),
    // x = 720 * 4
    new BackgroundObject("img/5_background/layers/air.png", 720 * 4),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 4
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 4
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 4
    )
  ],
  [
    new Coin(300, 200),
    new Coin(400, 200),

    new Coin(500, 130),
    new Coin(600, 130),

    new Coin(700, 130),
    new Coin(800, 130),

    new Coin(900, 130),
    new Coin(1000, 130),

    new Coin(1100, 130),
    new Coin(1200, 130),

    new Coin(1300, 130),
    new Coin(1400, 130),

    new Coin(1500, 130),
    new Coin(1600, 130)
  ],
  [
    new Bottle(350, 360),
    new Bottle(450, 360),
    new Bottle(550, 360),
    new Bottle(650, 360),
    new Bottle(750, 360),
    new Bottle(850, 360),
    new Bottle(950, 360)
  ]
);
