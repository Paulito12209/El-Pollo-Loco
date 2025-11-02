class Endboss extends MovableObject {
  y = 230;
  width = 150;
  height = 200;
  energy = 100;
  speed = 25;

  isDead = false;
  hasPlayedDeathAnimation = false;
  hasPlayedAlert = false;
  isAttacking = false;
  isWalking = false;
  endGame = false;

  offset = {
    top: 40,
    bottom: 20,
    left: 10,
    right: 20
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
    this.walkInterval = null;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (isPaused) return;

      if (this.isDead && this.hasPlayedDeathAnimation) {
        this.moveDown();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (isPaused) return;

      this.checkDeath();
      this.checkAlert();

      if (this.isDead && !this.hasPlayedDeathAnimation) {
        this.playAnimation(this.IMAGES_DEATH);
      } else if (!this.isDead) {
        if (this.isHurt() && !this.isWalking && !this.isAttacking) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAttacking) {
          this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.isWalking) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.playAnimation(this.IMAGES_ALERT);
        }
      }
    }, 150);
  }

  performCounterAttack(character) {
    if (isPaused || this.isWalking || this.isAttacking) return;
    this.lookAtCharacter(character);

    setTimeout(() => {
      if (isPaused) return;
      this.startWalkingPhase();
    }, 300);
  }

  startWalkingPhase() {
    this.isWalking = true;
    let walkFrames = 0;
    let targetWalkFrames = 8;
    let walkSpeed = 100;

    this.walkInterval = setInterval(() => {
      if (isPaused) return;

      if (this.otherDirection) {
        this.moveRight();
      } else {
        this.moveLeft();
      }

      walkFrames++;

      if (walkFrames >= targetWalkFrames) {
        clearInterval(this.walkInterval);
        this.walkInterval = null;
        this.isWalking = false;
        this.startAttackAnimation();
      }
    }, walkSpeed);
  }

  startAttackAnimation() {
    if (isPaused) return;

    this.isAttacking = true;
    this.speed = 0;
    let animationSpeed = 250;

    setTimeout(() => {
      this.isAttacking = false;
      this.speed = 25;
    }, this.IMAGES_ATTACK.length * animationSpeed);
  }

  checkAlert() {
    if (this.energy <= 60 && !this.hasPlayedAlert) {
      this.playAlertAnimation();
      this.hasPlayedAlert = true;
    }
  }

  playAlertAnimation() {
    let imageIndex = 0;
    let interval = setInterval(() => {
      if (isPaused) return;

      this.loadImage(this.IMAGES_ALERT[imageIndex]);
      imageIndex++;
      if (imageIndex >= this.IMAGES_ALERT.length) {
        clearInterval(interval);
      }
    }, 500);
  }

  checkDeath() {
    if (this.energy <= 0 && !this.hasPlayedDeathAnimation) {
      this.isDead = true;
      setTimeout(() => {
        if (!isPaused) {
          this.hasPlayedDeathAnimation = true;
          this.endGame = true;
        }
      }, this.IMAGES_DEATH.length * 220);
    }
  }

  moveDown() {
    this.y += 2;
  }

  lookAtCharacter(character) {
    if (character.x < this.x) {
      this.otherDirection = false;
    } else {
      this.otherDirection = true;
    }
  }
}
