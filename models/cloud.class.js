class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 400;
  speed = 0.15;

  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }

  moveLeft() {
    this.setGameInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
