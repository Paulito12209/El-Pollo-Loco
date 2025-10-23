class Bottle extends MovableObject {
  width = 70;
  height = 70;

  IMAGES_BOTTLE = [
    "../img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "../img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];

  constructor(x, y) {
    super().loadImage("../img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
  }
}
