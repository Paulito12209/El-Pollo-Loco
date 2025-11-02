const level1 = new Level(
  [
    // === ZONE 1: Einstieg (500-1100) - Einzelne Chickens zum Warmwerden ===
    new Chicken(500),
    new Chicken(900),
    new Chicken(1300),

    // === ZONE 2: Erste Herausforderung (1500-2100) - Gruppen von 2-3 ===
    new Chicken(1500),
    new Chicken(1700),

    new Chicken(2000),
    new Chicken(2200),
    new Chicken(2300),

    // === ZONE 3: Pause (2500-2700) - Vereinzelt ===
    new Chicken(2700),

    // === ZONE 4: Dichte Welle (3000-3800) - Viele Chickens! ===
    new Chicken(3000),
    new Chicken(3200),
    new Chicken(3300),
    new Chicken(3500),
    new Chicken(3600),
    new Chicken(3800),

    // === ZONE 5: Vor dem Endboss (4000-4600) - Letzte Gegner ===
    new Chicken(4000),
    new Chicken(4300),

    new Chicken(4500),
    new Chicken(4700),
    new Chicken(5000),
    new Chicken(5300),

    new Chicken(5500),
    new Chicken(5700),
    new Chicken(6200),
    new Chicken(6800),

    new Chicken(7500),
    new Chicken(7700),

    // === ENDBOSS ZONE (5200) ===
    new Endboss(4500)
  ],
  [
    // Wolken - angepasst an neues Level
    new Cloud("img/5_background/layers/4_clouds/1.png", 0),
    new Cloud("img/5_background/layers/4_clouds/2.png", 720),
    new Cloud("img/5_background/layers/4_clouds/2.png", 1440),
    new Cloud("img/5_background/layers/4_clouds/1.png", 2160),
    new Cloud("img/5_background/layers/4_clouds/1.png", 2880),
    new Cloud("img/5_background/layers/4_clouds/2.png", 3600),
    new Cloud("img/5_background/layers/4_clouds/1.png", 4320),
    new Cloud("img/5_background/layers/4_clouds/1.png", 5040)
  ],
  [
    // Hintergrund - erweitert für längeres Level
    // x = -720
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    // X = 0
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
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
    ),
    // x = 720 * 5
    new BackgroundObject("img/5_background/layers/air.png", 720 * 5),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 5
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 5
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      720 * 5
    ),
    // x = 720 * 6
    new BackgroundObject("img/5_background/layers/air.png", 720 * 6),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 6
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 6
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 6
    ),
    // x = 720 * 7
    new BackgroundObject("img/5_background/layers/air.png", 720 * 7),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 7
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 7
    ),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720 * 7)
  ],
  [
    // === MÜNZEN gleichmäßig verteilt ===
    new Coin(600, 200),
    new Coin(800, 200),

    new Coin(1200, 130),
    new Coin(1400, 130),
    new Coin(1600, 130),

    new Coin(2000, 200),
    new Coin(2200, 200),

    new Coin(2600, 130),
    new Coin(2800, 130),
    new Coin(3000, 130),
    new Coin(3200, 130),

    new Coin(4400, 200),
    new Coin(4600, 200)
  ],
  [
    // === FLASCHEN strategisch verteilt ===
    new Bottle(700, 360),
    new Bottle(1300, 360),
    new Bottle(1900, 360),
    new Bottle(2500, 360),
    new Bottle(3100, 360),
    new Bottle(3700, 360),
    new Bottle(4300, 360)
  ]
);
