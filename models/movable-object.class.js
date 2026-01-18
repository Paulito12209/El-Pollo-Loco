/**
 * Base class for all objects that can move in the game world.
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
   * Applies gravity to the object, making it fall when above ground.
   */
  applyGravity() {
    this.setGameInterval(() => {
      if (isPaused) return;

      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        // Clamp to ground to avoid sinking after landing
        if (!(this instanceof ThrowableObject)) {
          const groundY = 220;
          if (this.y >= groundY && this.speedY <= 0) {
            this.y = groundY;
            this.speedY = 0;
            // Reset consecutive boss jumps counter on landing
            if (typeof this.consecutiveBossJumps !== 'undefined') {
              this.consecutiveBossJumps = 0;
            }
          }
        }
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level.
   * @returns {boolean} True if object is in the air
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 220;
    }
  }

  /**
   * Checks collision between this object and another movable object.
   * Uses offset values to create more accurate hitboxes.
   * @param {MovableObject} mo - The other object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    return (
      this.x + this.width - (this.offset?.right || 0) >
      mo.x + (mo.offset?.left || 0) &&
      this.y + this.height - (this.offset?.bottom || 0) >
      mo.y + (mo.offset?.top || 0) &&
      this.x + (this.offset?.left || 0) <
      mo.x + mo.width - (mo.offset?.right || 0) &&
      this.y + (this.offset?.top || 0) <
      mo.y + mo.height - (mo.offset?.bottom || 0)
    );
  }

  /**
   * Reduces object's energy when hit and records the hit timestamp.
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
   * Checks if the object was recently hit (within 1 second).
   * @returns {boolean} True if object is in hurt state
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Checks if the object's energy has reached zero.
   * @returns {boolean} True if object is dead
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation by cycling through an array of images.
   * @param {string[]} images - Array of image paths for the animation
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right by its speed value.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed value.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting vertical velocity.
   */
  jump() {
    this.speedY = 30;
  }
}
