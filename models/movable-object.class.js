class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
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
    // Die 4 Bedingungen der Collision-Methode, angepasst mit Offsets
    return (
      // Bedingung 1: Rechts → Links (x + width - offset.right > mo.x + mo.offset.left)
      this.x + this.width - (this.offset?.right || 0) >
        mo.x + (mo.offset?.left || 0) &&
      // Bedingung 2: Unten → Oben (y + height - offset.bottom > mo.y + mo.offset.top)
      this.y + this.height - (this.offset?.bottom || 0) >
        mo.y + (mo.offset?.top || 0) &&
      // Bedingung 3: Links → Rechts (x + offset.left < mo.x + mo.width - mo.offset.right)
      this.x + (this.offset?.left || 0) <
        mo.x + mo.width - (mo.offset?.right || 0) &&
      // Bedingung 4: Oben → Unten (y + offset.top < mo.y + mo.height - mo.offset.bottom)
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
    let timePassed = new Date().getTime() - this.lastHit; // Diff in ms
    timePassed = timePassed / 1000; // Diff in s
    return timePassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 % 6; => 0, Rest 0
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
