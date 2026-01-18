/**
 * Represents a cloud in the background that moves slowly left.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 400;
  speed = 0.15;

  /**
   * Creates a new cloud at the specified position.
   * @param {string} imagePath - Path to the cloud image
   * @param {number} x - Starting x position
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  /**
   * Starts the cloud animation interval.
   */
  animate() {
    this.moveLeft();
  }

  /**
   * Moves the cloud left continuously (respects game pause state).
   */
  moveLeft() {
    this.setGameInterval(() => {
      if (isPaused) return;
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
