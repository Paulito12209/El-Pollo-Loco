class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;

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
          }
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 220;
    }
  }

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

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
