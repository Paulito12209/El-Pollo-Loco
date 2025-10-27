class Endboss extends MovableObject {
  y = 235;
  width = 150;
  height = 200;
  energy = 100;
  isDead = false;

  offset = {
    top: 40, // Viel transparenter Raum über dem Kopf
    bottom: 20, // Nur 20px unter den Füßen (siehe Screenshot!)
    left: 10, // 25px von links
    right: 20 // 25px von rechts
  };

  IMAGES_WALKING = [
    "../img/4_enemie_boss_chicken/2_alert/G5.png",
    "../img/4_enemie_boss_chicken/2_alert/G6.png",
    "../img/4_enemie_boss_chicken/2_alert/G7.png",
    "../img/4_enemie_boss_chicken/2_alert/G8.png",
    "../img/4_enemie_boss_chicken/2_alert/G9.png",
    "../img/4_enemie_boss_chicken/2_alert/G10.png",
    "../img/4_enemie_boss_chicken/2_alert/G11.png",
    "../img/4_enemie_boss_chicken/2_alert/G12.png"
  ];

  IMAGES_HURT = [
    "../img/4_enemie_boss_chicken/4_hurt/G21.png",
    "../img/4_enemie_boss_chicken/4_hurt/G22.png",
    "../img/4_enemie_boss_chicken/4_hurt/G23.png"
  ];

  constructor(x) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.x = x;
    this.animate();
  }

  animate() {
    // Bewegungs-Loop (60 FPS) - bleibt unverändert ✅
    setInterval(() => {
      if (this.isDead) {
        this.moveDown(); // Sinkt nach unten, wenn Endboss stirbt
      }
    }, 1000 / 60);

    // Animations-Loop - HIER kommt die Hurt-Animation rein! 👇
    setInterval(() => {
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT); // ✅ Hurt-Animation abspielen
      } else {
        this.playAnimation(this.IMAGES_WALKING); // Normal laufen
      }
    }, 220);
  }

  // animate() {
  //   // Bewegungs-Loop (60 FPS) - bleibt unverändert ✅
  //   setInterval(() => {
  //     if (this.isDead) {
  //       this.moveDown(); // Sinkt nach unten, wenn Endboss stirbt
  //     }
  //   }, 1000 / 60);

  //   // Animations-Loop - HIER kommt die Hurt-Animation rein! 👇
  //   setInterval(() => {
  //     if (this.isHurt()) {
  //       this.playAnimation(this.IMAGES_HURT); // Hurt-Animation abspielen ✅
  //     } else {
  //       this.playAnimation(this.IMAGES_WALKING); // Normal laufen
  //     }
  //   }, 220);
  // }

  // Neue Methode hinzufügen ✅
  moveDown() {
    this.y += 2; // Geschwindigkeit nach unten
  }
}
