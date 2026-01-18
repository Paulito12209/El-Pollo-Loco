/**
 * Represents a normal chicken enemy.
 * Walks left across the screen and can be killed by jumping on it or throwing bottles.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  y = 358;
  height = 60;
  width = 60;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  isDead = false;

  /**
   * Creates a new chicken at the specified x position.
   * Speed is randomized between 0.15 and 0.40 for variety.
   * @param {number} x - The starting x position
   */
  constructor(x) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGE_DEAD);

    this.x = x;
    this.speed = 0.5 + (0.5 * Math.random());
    this.animate();
  }

  /**
   * Starts the chicken's movement and animation intervals.
   */
  animate() {
    this.setGameInterval(() => {
      if (isPaused) return;

      if (!this.isDead) {
        this.moveLeft();
      } else {
        this.moveDown();
      }
    }, 1000 / 60);

    this.setGameInterval(() => {
      if (isPaused) return;

      if (this.isDead) {
        this.loadImage(this.IMAGE_DEAD);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 220);
  }

  /**
   * Moves the chicken downward (used when dead to fall off screen).
   */
  moveDown() {
    this.y += 1;
  }
}
