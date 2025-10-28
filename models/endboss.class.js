class Endboss extends MovableObject {
  y = 235;
  width = 150;
  height = 200;
  energy = 100;
  speed = 5;

  // Flags
  isDead = false;
  hasPlayedDeathAnimation = false;
  hasPlayedAlert = false;
  firstCounterAttack = false;
  secondCounterAttack = false;

  offset = {
    top: 40, // Viel transparenter Raum über dem Kopf
    bottom: 20, // Nur 20px unter den Füßen (siehe Screenshot!)
    left: 10, // 25px von links
    right: 20 // 25px von rechts
  };

  IMAGES_WALKING = [
    "../img/4_enemie_boss_chicken/1_walk/G1.png",
    "../img/4_enemie_boss_chicken/1_walk/G2.png",
    "../img/4_enemie_boss_chicken/1_walk/G3.png",
    "../img/4_enemie_boss_chicken/1_walk/G4.png"
  ];

  IMAGES_ALERT = [
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

  IMAGES_ATTACK = [
    "../img/4_enemie_boss_chicken/3_attack/G13.png",
    "../img/4_enemie_boss_chicken/3_attack/G14.png",
    "../img/4_enemie_boss_chicken/3_attack/G15.png",
    "../img/4_enemie_boss_chicken/3_attack/G16.png",
    "../img/4_enemie_boss_chicken/3_attack/G17.png",
    "../img/4_enemie_boss_chicken/3_attack/G18.png",
    "../img/4_enemie_boss_chicken/3_attack/G19.png",
    "../img/4_enemie_boss_chicken/3_attack/G20.png"
  ];

  IMAGES_DEATH = [
    "../img/4_enemie_boss_chicken/5_dead/G24.png",
    "../img/4_enemie_boss_chicken/5_dead/G25.png",
    "../img/4_enemie_boss_chicken/5_dead/G26.png"
  ];

  constructor(x) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEATH);
    this.x = x;
    this.animate();
  }

  animate() {
    // ✅ 28-10-2025 - 22:06
    // Bewegungs-Loop (60 FPS)
    setInterval(() => {
      // Nur nach unten bewegen, WENN Death Animation fertig ist!
      if (this.isDead && this.hasPlayedDeathAnimation) {
        this.moveDown();
      }
    }, 1000 / 60);

    // Animations-Loop
    setInterval(() => {
      this.checkDeath();
      this.checkAlert();
      this.checkCounterAttacks();

      if (this.isDead && !this.hasPlayedDeathAnimation) {
        // 👈 NEU: Während Death Animation läuft
        this.playAnimation(this.IMAGES_DEATH);
      } else if (!this.isDead) {
        // Normale Animationen nur, wenn Boss NICHT tot ist
        if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else {
          this.playAnimation(this.IMAGES_ALERT);
        }
      }
    }, 220);
  }

  // === ALERT ANIMATION (bei 60% Leben) ===
  checkAlert() {
    // ✅ 28-10-2025 22:08
    if (this.energy <= 60 && !this.hasPlayedAlert) {
      this.playAlertAnimation();
      this.hasPlayedAlert = true; // aktiviert Flag
    }
  }

  playAlertAnimation() {
    // ✅ 28-10-2025 22:08
    let imageIndex = 0;
    let interval = setInterval(() => {
      this.loadImage(this.IMAGES_ALERT[imageIndex]);
      imageIndex++;
      if (imageIndex >= this.IMAGES_ALERT.length) {
        clearInterval(interval);
      }
    }, 150);
  }

  checkCounterAttacks() {
    // ✅ 28-10-2025 22:08
    // 1. Counter-Attack bei 40 Energie (normal)
    if (this.energy <= 40 && !this.firstCounterAttack) {
      this.playFirstCounterAttack();
      this.firstCounterAttack = true;
    }

    // 2. Counter-Attack bei 20 Energie (schneller!)
    if (
      this.energy <= 20 &&
      !this.secondCounterAttack &&
      this.firstCounterAttack
    ) {
      this.playSecondCounterAttack();
      this.secondCounterAttack = true;
    }
  }

  // === 1. COUNTER-ATTACK (Normal) ===

  playFirstCounterAttack() {
    // ✅ 28-10-2025 22:08
    let imageIndex = 0;
    this.speed = 15;

    let walkInterval = setInterval(() => {
      this.loadImage(this.IMAGES_WALKING[imageIndex]);
      this.moveLeft();
      imageIndex++;

      if (imageIndex >= this.IMAGES_WALKING.length) {
        clearInterval(walkInterval);
        this.startFirstAttackAnimation();
      }
    }, 100);
  }

  startFirstAttackAnimation() {
    // ✅ 28-10-2025 22:08
    let imageIndex = 0;

    let attackInterval = setInterval(() => {
      this.loadImage(this.IMAGES_ATTACK[imageIndex]);
      imageIndex++;

      if (imageIndex >= this.IMAGES_ATTACK.length) {
        clearInterval(attackInterval);
        this.speed = 0;
      }
    }, 150);
  }

  // === 2. COUNTER-ATTACK (Schneller!) ===

  playSecondCounterAttack() {
    // ✅ 28-10-2025 22:08
    let imageIndex = 0;
    this.speed = 20; // Schneller!

    let walkInterval = setInterval(() => {
      this.loadImage(this.IMAGES_WALKING[imageIndex]);
      this.moveLeft();
      imageIndex++;

      if (imageIndex >= this.IMAGES_WALKING.length) {
        clearInterval(walkInterval);
        this.startSecondAttackAnimation();
      }
    }, 50); // Doppelt so schnell!
  }

  startSecondAttackAnimation() {
    // ✅ 28-10-2025 22:08
    let imageIndex = 0;

    let attackInterval = setInterval(() => {
      this.loadImage(this.IMAGES_ATTACK[imageIndex]);
      imageIndex++;

      if (imageIndex >= this.IMAGES_ATTACK.length) {
        clearInterval(attackInterval);
        this.speed = 0;
      }
    }, 100); // Schneller!
  }

  // === DEATH ANIMATION ===
  checkDeath() {
    // ✅ 28-10-2025 22:08
    if (this.energy <= 0 && !this.isDead) {
      this.isDead = true;

      // Setze Flag nach der Death Animation
      setTimeout(() => {
        this.hasPlayedDeathAnimation = true;
      }, this.IMAGES_DEATH.length * 220); // 3 Bilder * 220ms = 660ms
    }
  }

  moveDown() {
    this.y += 2; // Geschwindigkeit nach unten
  }
}
