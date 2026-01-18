/**
 * Creates Level 1 with all enemies, clouds, backgrounds, coins, and bottles.
 * @returns {Level} A fully configured Level 1 instance
 */
function createLevel1() {
  const level = new Level(
    [
      // === ZONE 1: Introduction (500-1300) - Single chickens for warm-up ===
      new Chicken(500),
      new Chicken(900),
      new Chicken(1300),

      // === ZONE 2: First challenge (1500-2300) - Groups of 2-3 ===
      new Chicken(1500),
      new Chicken(1700),
      new Chicken(2000),
      new Chicken(2200),
      new Chicken(2300),

      // === ZONE 3: Break (2700) - Scattered ===
      new Chicken(2700),

      // === ZONE 4: Dense wave (3000-3800) - Many chickens! ===
      new Chicken(3000),
      new Chicken(3200),
      new Chicken(3300),
      new Chicken(3500),
      new Chicken(3600),
      new Chicken(3800),

      // === ZONE 5: Before the endboss (4000-4300) - Final enemies ===
      new Chicken(4000),
      new Chicken(4300),

      // === ZONE 6: After endboss (4700-7700) - Optional additional enemies ===
      new Chicken(4700),
      new Chicken(5000),
      new Chicken(5300),
      new Chicken(5500),
      new Chicken(5700),
      new Chicken(6200),
      new Chicken(6800),
      new Chicken(7500),
      new Chicken(7700),

      // === ENDBOSS at x=4500 ===
      new Endboss(4500)
    ],
    [
      // Clouds distributed across the level
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
      // Background objects - extended for longer level
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
      // === COINS: Mix of rows and stacks ===
      // Early row (6 in a line)
      new Coin(600, 200),
      new Coin(680, 200),
      new Coin(760, 200),
      new Coin(840, 200),
      new Coin(920, 200),
      new Coin(1000, 200),

      // Row at 1200-1600 (3 in a line)
      new Coin(1200, 130),
      new Coin(1400, 130),
      new Coin(1600, 130),

      // Stacks (2-3 on top of each other)
      new Coin(2000, 200),
      new Coin(2000, 160),
      new Coin(2200, 220),
      new Coin(2200, 180),
      new Coin(2200, 140),

      // Middle row (4 in a line)
      new Coin(2600, 130),
      new Coin(2680, 130),
      new Coin(2760, 130),
      new Coin(2840, 130),

      // Zigzag row
      new Coin(3000, 130),
      new Coin(3080, 170),
      new Coin(3160, 130),
      new Coin(3240, 170),
      new Coin(3320, 130),

      // Before the boss: dense short row
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
