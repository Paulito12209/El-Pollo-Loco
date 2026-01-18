/**
 * Represents a normal chicken enemy.
 * Walks left and can be defeated by jumps or bottles.
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
   * Creates a new chicken at the specified position.
   * Speed is randomized for variety.
   * @param {number} x - Starting X position
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
   * Starts the movement and animation intervals.
   */
  animate() {
    this.setGameInterval(() => this.handleMovement(), 1000 / 60);
    this.setGameInterval(() => this.handleAnimation(), 220);
  }

  /**
   * Handles the movement logic.
   */
  handleMovement() {
    if (isPaused) return;
    if (this.isDead) {
      this.moveDown();
    } else {
      this.moveLeft();
    }
  }

  /**
   * Handles the animation logic.
   */
  handleAnimation() {
    if (isPaused) return;
    if (this.isDead) {
      this.loadImage(this.IMAGE_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Moves the chicken downward (after death).
   */
  moveDown() {
    this.y += 1;
  }
}
