/**
 * Base class for all movable game objects.
 * Provides physics (gravity, collision), movement methods, and state tracking.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    this.setGameInterval(() => {
      if (isPaused) return;
      this.updateGravityPosition();
    }, 1000 / 25);
  }

  /**
   * Updates position based on gravity.
   */
  updateGravityPosition() {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      this.clampToGround();
    }
  }

  /**
   * Clamps the object to ground level.
   */
  clampToGround() {
    if (this instanceof ThrowableObject) return;
    if (this.y >= 220 && this.speedY <= 0) {
      this.y = 220;
      this.speedY = 0;
      this.resetConsecutiveJumps();
    }
  }

  /**
   * Resets the consecutive jumps counter.
   */
  resetConsecutiveJumps() {
    if (typeof this.consecutiveBossJumps !== 'undefined') {
      this.consecutiveBossJumps = 0;
    }
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if object is in the air
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    }
    return this.y < 220;
  }

  /**
   * Checks collision between this and another object.
   * Uses offset values for more precise hitboxes.
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if collision occurs
   */
  isColliding(mo) {
    const thisRight = this.x + this.width - (this.offset?.right || 0);
    const thisBottom = this.y + this.height - (this.offset?.bottom || 0);
    const thisLeft = this.x + (this.offset?.left || 0);
    const thisTop = this.y + (this.offset?.top || 0);
    const moRight = mo.x + mo.width - (mo.offset?.right || 0);
    const moBottom = mo.y + mo.height - (mo.offset?.bottom || 0);
    const moLeft = mo.x + (mo.offset?.left || 0);
    const moTop = mo.y + (mo.offset?.top || 0);
    return thisRight > moLeft && thisBottom > moTop && thisLeft < moRight && thisTop < moBottom;
  }

  /**
   * Reduces energy when hit.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object was recently hit.
   * @returns {boolean} True if in hurt state
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 1000;
  }

  /**
   * Checks if energy is depleted.
   * @returns {boolean} True if dead
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation by cycling through images.
   * @param {string[]} images - Array of image paths
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 30;
  }
}
