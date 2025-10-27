class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 400;
  speed = 0.15;

  /**
   * Erstellt eine Wolke mit konfigurierbarer Position
   * @param {string} imagePath - Pfad zum Wolkenbild
   * @param {number} x - horizontale Position
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);

    this.x = x;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
