class Coin extends MovableObject {
  width = 100;
  height = 100;

  offset = {
    top: 35, // Abstand vom oberen Rand zur Münze
    bottom: 35, // Abstand vom unteren Rand zur Münze
    left: 35, // Abstand vom linken Rand zur Münze
    right: 35 // Abstand vom rechten Rand zur Münze
  };

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 300);
  }
}
