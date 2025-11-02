class ThrowableObject extends MovableObject {
  hasHit = false;
  throwDirection = 1;

  constructor(x, y, direction) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 60;
    this.throwDirection = direction;
    this.throw();
  }

  throw() {
    this.speedY = 14;
    this.applyGravity();
    setInterval(() => {
      if (isPaused) return;
      this.x += 10 * this.throwDirection;
    }, 25);
  }
}
