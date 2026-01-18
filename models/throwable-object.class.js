/**
 * Represents a thrown object (salsa bottle).
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  hasHit = false;
  throwDirection = 1;

  /**
   * Creates a new throwable object at the specified position.
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} direction - Throw direction (1=right, -1=left)
   */
  constructor(x, y, direction) {
    super().loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 60;
    this.throwDirection = direction;
    this.throw();
  }

  /**
   * Starts the throwing process with gravity and horizontal movement.
   */
  throw() {
    this.speedY = 14;
    this.applyGravity();
    this.setGameInterval(() => this.moveHorizontal(), 25);
  }

  /**
   * Moves the object horizontally in throw direction.
   */
  moveHorizontal() {
    if (isPaused) return;
    this.x += 10 * this.throwDirection;
  }
}
