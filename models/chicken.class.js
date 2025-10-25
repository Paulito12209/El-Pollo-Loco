class Chicken extends MovableObject {
  y = 365;
  height = 60;
  width = 60;

  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGE_DEAD = "../img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  isDead = false;

  // currentImage = 0;

  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGE_DEAD);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;

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
    this.y += 1; // Geschwindigkeit nach unten (5 Pixel pro Frame)
  }
}
