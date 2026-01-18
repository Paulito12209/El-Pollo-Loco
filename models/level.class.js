/**
 * Represents a game level.
 * Contains all enemies, clouds, backgrounds, coins, and bottles.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2800;
  initialCoinsCount = 0;
  initialBottlesCount = 0;

  /**
   * Creates a new level with all game objects.
   * @param {MovableObject[]} enemies - Array of enemy objects
   * @param {Cloud[]} clouds - Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Array of background objects
   * @param {Coin[]} coins - Array of coin objects
   * @param {Bottle[]} bottles - Array of bottle objects
   */
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
