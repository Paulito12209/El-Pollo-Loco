/**
 * Represents a collectible coin.
 * Animates between two images.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  width = 100;
  height = 100;

  offset = {
    top: 35,
    bottom: 35,
    left: 35,
    right: 35
  };

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new coin at the specified position.
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the coin animation loop.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 300);
  }
}
