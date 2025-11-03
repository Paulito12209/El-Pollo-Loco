function createLevel1() {
  const level = new Level(
    [
      // === ZONE 1: Einstieg (500-1300) - Einzelne Chickens zum Warmwerden ===
      new Chicken(500),
      new Chicken(900),
      new Chicken(1300),

      // === ZONE 2: Erste Herausforderung (1500-2300) - Gruppen von 2-3 ===
      new Chicken(1500),
      new Chicken(1700),
      new Chicken(2000),
      new Chicken(2200),
      new Chicken(2300),

      // === ZONE 3: Pause (2700) - Vereinzelt ===
      new Chicken(2700),

      // === ZONE 4: Dichte Welle (3000-3800) - Viele Chickens! ===
      new Chicken(3000),
      new Chicken(3200),
      new Chicken(3300),
      new Chicken(3500),
      new Chicken(3600),
      new Chicken(3800),

      // === ZONE 5: Vor dem Endboss (4000-4300) - Letzte Gegner ===
      new Chicken(4000),
      new Chicken(4300),

      // === ZONE 6: Nach Endboss (4700-7700) - Optionale zusätzliche Gegner ===
      new Chicken(4700),
      new Chicken(5000),
      new Chicken(5300),
      new Chicken(5500),
      new Chicken(5700),
      new Chicken(6200),
      new Chicken(6800),
      new Chicken(7500),
      new Chicken(7700),

      // === ENDBOSS bei x=4500 ===
      new Endboss(4500)
    ],
    [
      // Wolken über das gesamte Level verteilt
      new Cloud("img/5_background/layers/4_clouds/1.png", 0),
      new Cloud("img/5_background/layers/4_clouds/2.png", 720),
      new Cloud("img/5_background/layers/4_clouds/2.png", 1440),
      new Cloud("img/5_background/layers/4_clouds/1.png", 2160),
      new Cloud("img/5_background/layers/4_clouds/1.png", 2880),
      new Cloud("img/5_background/layers/4_clouds/2.png", 3600),
      new Cloud("img/5_background/layers/4_clouds/1.png", 4320),
      new Cloud("img/5_background/layers/4_clouds/1.png", 5040),
      new Cloud("img/5_background/layers/4_clouds/2.png", 5760),
      new Cloud("img/5_background/layers/4_clouds/1.png", 6480)
    ],
    [
      // Hintergrund-Objekte - erweitert für längeres Level
      // x = -720
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

      // x = 0
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      // x = 720
      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

      // x = 1440 (720 * 2)
      new BackgroundObject("img/5_background/layers/air.png", 1440),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1440),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        1440
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1440),

      // x = 2160 (720 * 3)
      new BackgroundObject("img/5_background/layers/air.png", 2160),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2160),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        2160
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2160),

      // x = 2880 (720 * 4)
      new BackgroundObject("img/5_background/layers/air.png", 2880),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 2880),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        2880
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 2880),

      // x = 3600 (720 * 5)
      new BackgroundObject("img/5_background/layers/air.png", 3600),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 3600),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        3600
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 3600),

      // x = 4320 (720 * 6)
      new BackgroundObject("img/5_background/layers/air.png", 4320),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 4320),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        4320
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 4320),

      // x = 5040 (720 * 7)
      new BackgroundObject("img/5_background/layers/air.png", 5040),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 5040),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        5040
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 5040),

      // x = 5760 (720 * 8)
      new BackgroundObject("img/5_background/layers/air.png", 5760),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 5760),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        5760
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 5760),

      // x = 6480 (720 * 9)
      new BackgroundObject("img/5_background/layers/air.png", 6480),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 6480),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        6480
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 6480),

      // x = 7200 (720 * 10)
      new BackgroundObject("img/5_background/layers/air.png", 7200),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 7200),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        7200
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 7200)
    ],
    [
      // === COINS: Mischungen aus Reihen und Stapeln ===
      // Frühe Reihe (6 in einer Linie)
      new Coin(600, 200),
      new Coin(680, 200),
      new Coin(760, 200),
      new Coin(840, 200),
      new Coin(920, 200),
      new Coin(1000, 200),

      // Reihe bei 1200-1600 (3 in einer Linie)
      new Coin(1200, 130),
      new Coin(1400, 130),
      new Coin(1600, 130),

      // Stapel (2-3 übereinander)
      new Coin(2000, 200),
      new Coin(2000, 160),
      new Coin(2200, 220),
      new Coin(2200, 180),
      new Coin(2200, 140),

      // Mittlere Reihe (4 in einer Linie)
      new Coin(2600, 130),
      new Coin(2680, 130),
      new Coin(2760, 130),
      new Coin(2840, 130),

      // Zickzack-Reihe
      new Coin(3000, 130),
      new Coin(3080, 170),
      new Coin(3160, 130),
      new Coin(3240, 170),
      new Coin(3320, 130),

      // Vor dem Boss: dichte kurze Reihe
      new Coin(4400, 200),
      new Coin(4480, 200),
      new Coin(4560, 200),
      new Coin(4640, 200)
    ],
    [
      new Bottle(700, 350),
      new Bottle(1300, 350),
      new Bottle(1900, 350),
      new Bottle(2500, 350),
      new Bottle(3100, 350),
      new Bottle(3700, 350),
      new Bottle(4300, 350)
    ]
  );
  
  level.level_end_x = 7200;
  return level;
}
