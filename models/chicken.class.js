class Chicken extends MovableObject {
  y = 358;
  height = 60;
  width = 60;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  isDead = false;

  // currentImage = 0;

  constructor(x) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGE_DEAD);

    this.x = x; // Nutzt definierten Wert aus Lv1.js
    this.speed = 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      } else {
        this.moveDown(); // Totes Chicken sinkt nach unten
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead) {
        this.loadImage(this.IMAGE_DEAD);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 220);
  }

  moveDown() {
    this.y += 1; // Geschwindigkeit nach unten (1 Pixel pro Frame)
  }
}
