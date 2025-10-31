class Endboss extends MovableObject {
  y = 230;
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

  // ✅29-10-2025
  isAttacking = false;
  isWalking = false;
  endGame = false;
  // attackAnimationFinished = false;

  offset = {
    top: 40, // Viel transparenter Raum über dem Kopf
    bottom: 20, // Nur 20px unter den Füßen (siehe Screenshot!)
    left: 10, // 25px von links
    right: 20 // 25px von rechts
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png"
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png"
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png"
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png"
  ];

  IMAGES_DEATH = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png"
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
    // ✅ 29-10-2025
    // Bewegungs-Loop (bleibt gleich)
    setInterval(() => {
      if (this.isDead && this.hasPlayedDeathAnimation) {
        this.moveDown();
      }
    }, 1000 / 60);

    // ✅ Animations-Loop
    setInterval(() => {
      this.checkDeath();
      this.checkAlert();
      this.checkCounterAttacks();

      if (this.isDead && !this.hasPlayedDeathAnimation) {
        this.playAnimation(this.IMAGES_DEATH);
      } else if (!this.isDead) {
        // ✅ Attack Animation hat Priorität
        if (this.isAttacking) {
          this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.isWalking) {
          // ✅ Walking Animation
          this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else {
          this.playAnimation(this.IMAGES_ALERT);
        }
      }
    }, 150);
  }

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
    this.isWalking = true;
    this.speed = 15;

    let walkFrames = 0;
    let walkInterval = setInterval(() => {
      // ✅ Bewege in Richtung des Characters
      if (this.otherDirection) {
        this.moveRight(); // Character ist rechts
      } else {
        this.moveLeft(); // Character ist links
      }

      walkFrames++;
      if (walkFrames >= this.IMAGES_WALKING.length) {
        clearInterval(walkInterval);
        this.isWalking = false;
        this.startFirstAttackAnimation();
      }
    }, 100);
  }

  startFirstAttackAnimation() {
    this.isAttacking = true;
    this.speed = 0;

    // Attack Animation für 8 Frames (8 * 150ms = 1200ms)
    setTimeout(() => {
      this.isAttacking = false;
      // this.attackAnimationFinished = true;
    }, this.IMAGES_ATTACK.length * 150);
  }

  playSecondCounterAttack() {
    this.isWalking = true;
    this.speed = 20;

    let walkFrames = 0;
    let walkInterval = setInterval(() => {
      // ✅ Bewege in Richtung des Characters
      if (this.otherDirection) {
        this.moveRight(); // Character ist rechts
      } else {
        this.moveLeft(); // Character ist links
      }

      walkFrames++;
      if (walkFrames >= this.IMAGES_WALKING.length) {
        clearInterval(walkInterval);
        this.isWalking = false;
        this.startSecondAttackAnimation();
      }
    }, 50);
  }

  startSecondAttackAnimation() {
    this.isAttacking = true;
    this.speed = 0;

    // Attack Animation für 8 Frames (8 * 100ms = 800ms) = also etwas schneller!
    setTimeout(() => {
      this.isAttacking = false;
    }, this.IMAGES_ATTACK.length * 100);
  }

  checkDeath() {
    //✅ 29-10-2025
    if (this.energy <= 0 && !this.hasPlayedDeathAnimation) {
      this.isDead = true;
      setTimeout(() => {
        this.hasPlayedDeathAnimation = true;
        this.endGame = true;
      }, this.IMAGES_DEATH.length * 220);
    }
  }

  moveDown() {
    // ✅ 29-10-2025
    this.y += 2; // Geschwindigkeit nach unten
  }

  // ✅ Endboss schaut Character an (28-10-2025 -> 1)
  lookAtCharacter(character) {
    if (character.x < this.x) {
      this.otherDirection = false; // Nach links schauen
    } else {
      this.otherDirection = true; // Nach rechts schauen
    }
  }
}
