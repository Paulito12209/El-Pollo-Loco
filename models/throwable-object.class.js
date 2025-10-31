class ThrowableObject extends MovableObject {
  hasHit = false; // Flagt, ob die Flasche schon getroffen hat
  throwDirection = 1; // ✅ 28-10-2025: 1 = rechts, -1 = links

  constructor(x, y, direction) { // ✅ 29-10-2025 
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 60;
    this.throwDirection = direction; // Richtung speichern
    this.throw();
  }

  throw() { // ✅ 29-10-2025 
    this.speedY = 14;
    this.applyGravity();
    setInterval(() => {
      this.x += 10 * this.throwDirection; //   Mit Richtung multiplizieren!
    }, 25);
  }
}
