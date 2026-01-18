/**
 * Represents a collectible salsa bottle on the ground.
 * Can be picked up and thrown at enemies.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  width = 70;
  height = 70;

  offset = {
    top: 10,
    bottom: 10,
    left: 30,
    right: 15
  };

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];

  /**
   * Creates a new bottle at the specified position.
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
  }
}
