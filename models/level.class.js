class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2800;
  initialCoinsCount = 0;
  initialBottlesCount = 0;

  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
    this.initialCoinsCount = coins?.length || 0;
    this.initialBottlesCount = bottles?.length || 0;
  }
}
