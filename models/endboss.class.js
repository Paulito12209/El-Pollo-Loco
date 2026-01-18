/**
 * Represents the endboss - a giant chicken.
 * Has complex AI with walking, attack, hurt, and death states.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  y = 230;
  width = 150;
  height = 200;
  energy = 100;
  speed = 20;

  isDead = false;
  hasPlayedDeathAnimation = false;
  hasPlayedAlert = false;
  isAttacking = false;
  isWalking = false;
  endGame = false;

  offset = { top: 40, bottom: 20, left: 10, right: 20 };

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

  /**
   * Creates a new endboss at the specified position.
   * @param {number} x - Starting X position
   */
  constructor(x) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadAllImages();
    this.x = x;
    this.walkInterval = null;
    this.initializeSound();
    this.animate();
  }

  /**
   * Loads all animation images.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEATH);
  }

  /**
   * Initializes the hurt sound.
   */
  initializeSound() {
    this.hurtSound = new Audio("https://cdn.freesound.org/previews/770/770268_12983472-lq.mp3");
    this.hurtSound.volume = 0.3;
  }

  /**
   * Starts the animation intervals.
   */
  animate() {
    this.setGameInterval(() => this.handleMovement(), 1000 / 60);
    this.setGameInterval(() => this.handleAnimationState(), 150);
  }

  /**
   * Handles the movement logic.
   */
  handleMovement() {
    if (isPaused) return;
    if (this.isDead && this.hasPlayedDeathAnimation) {
      this.moveDown();
    }
  }

  /**
   * Handles the current animation state.
   */
  handleAnimationState() {
    if (isPaused) return;
    this.checkDeath();
    this.checkAlert();
    this.playCurrentStateAnimation();
  }

  /**
   * Plays the current state animation.
   */
  playCurrentStateAnimation() {
    if (this.isDead && !this.hasPlayedDeathAnimation) {
      this.playAnimation(this.IMAGES_DEATH);
    } else if (!this.isDead) {
      this.playAliveStateAnimation();
    }
  }

  /**
   * Plays the animation for alive state.
   */
  playAliveStateAnimation() {
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

  /**
   * Starts the counter attack after being hit.
   * @param {Character} character - The player character
   */
  performCounterAttack(character) {
    if (isPaused || this.isWalking || this.isAttacking) return;
    this.lookAtCharacter(character);
    setTimeout(() => {
      if (isPaused) return;
      this.startWalkingPhase();
    }, 300);
  }

  /**
   * Starts the walking phase of the counter attack.
   */
  startWalkingPhase() {
    this.isWalking = true;
    let walkFrames = 0;
    this.walkInterval = this.setGameInterval(() => {
      if (isPaused) return;
      this.executeWalkStep();
      walkFrames++;
      if (walkFrames >= 25) {
        this.finishWalkingPhase();
      }
    }, 100);
  }

  /**
   * Executes a walk step.
   */
  executeWalkStep() {
    if (this.otherDirection) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  /**
   * Finishes the walking phase and starts the attack.
   */
  finishWalkingPhase() {
    clearInterval(this.walkInterval);
    this.walkInterval = null;
    this.isWalking = false;
    this.startAttackAnimation();
  }

  /**
   * Plays the attack animation.
   */
  startAttackAnimation() {
    if (isPaused) return;
    this.isAttacking = true;
    this.speed = 0;
    let animationDuration = this.IMAGES_ATTACK.length * 250;
    setTimeout(() => {
      this.isAttacking = false;
      this.speed = 25;
    }, animationDuration);
  }

  /**
   * Plays the hurt sound.
   */
  playHurtSound() {
    if (this.hurtSound) {
      try {
        this.hurtSound.currentTime = 0;
        this.hurtSound.play().catch(() => { });
      } catch (e) { }
    }
  }

  /**
   * Handles hits on the endboss.
   */
  hit() {
    super.hit();
    this.playHurtSound();
  }

  /**
   * Checks if the alert state should be activated.
   */
  checkAlert() {
    if (this.energy <= 60 && !this.hasPlayedAlert) {
      this.playAlertAnimation();
      this.hasPlayedAlert = true;
    }
  }

  /**
   * Plays a special alert animation.
   */
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

  /**
   * Checks if the endboss dies.
   */
  checkDeath() {
    if (this.energy <= 0 && !this.hasPlayedDeathAnimation) {
      this.isDead = true;
      let deathAnimationDuration = this.IMAGES_DEATH.length * 220;
      setTimeout(() => {
        if (!isPaused) {
          this.hasPlayedDeathAnimation = true;
          this.endGame = true;
        }
      }, deathAnimationDuration);
    }
  }

  /**
   * Moves the endboss downward (after death).
   */
  moveDown() {
    this.y += 2;
  }

  /**
   * Makes the endboss look at the character.
   * @param {Character} character - The player character
   */
  lookAtCharacter(character) {
    this.otherDirection = character.x >= this.x;
  }
}
