/**
 * Represents the playable character (Pepe).
 * Handles movement, jumping, animations, and sound effects.
 * @extends MovableObject
 */
class Character extends MovableObject {
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png"
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png"
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png"
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png"
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png"
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png"
  ];

  offset = { top: 100, bottom: 20, left: 20, right: 20 };

  lastActivity = Date.now();
  isLongIdle = false;
  lastBounceTime = 0;
  consecutiveBossJumps = 0;
  world;
  speed = 4;
  y = 180;
  endGame = false;

  /**
   * Creates a new Character instance.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.initializeSounds();
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  /**
   * Initializes all sound effects.
   */
  initializeSounds() {
    this.snoreSound = new Audio("https://cdn.freesound.org/previews/796/796594_16895071-lq.mp3");
    this.snoreSound.volume = 0.3;
    this.snoreSound.loop = true;
    this.walkingSound = new Audio("https://cdn.freesound.org/previews/55/55690_321967-lq.mp3");
    this.walkingSound.volume = 0.3;
    this.walkingSound.loop = true;
    this.walkingSound.playbackRate = 1.5;
    this.jumpSound = new Audio("https://cdn.freesound.org/previews/805/805690_16337302-lq.mp3");
    this.jumpSound.volume = 0.3;
  }

  /**
   * Loads all animation images.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }

  /**
   * Starts the animation intervals.
   */
  animate() {
    this.setGameInterval(() => this.handleMovementAndCamera(), 1000 / 60);
    this.setGameInterval(() => this.handleAnimationState(), 120);
  }

  /**
   * Handles movement and camera update.
   */
  handleMovementAndCamera() {
    if (isPaused) return;
    this.handleHorizontalMovement();
    this.handleJumpInput();
    this.updateCameraPosition();
  }

  /**
   * Handles horizontal movement (left/right).
   */
  handleHorizontalMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastActivity = Date.now();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastActivity = Date.now();
    }
  }

  /**
   * Handles jump input.
   */
  handleJumpInput() {
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.jump();
      this.lastActivity = Date.now();
      this.playJumpSound();
    }
  }

  /**
   * Plays the jump sound.
   */
  playJumpSound() {
    if (this.jumpSound) {
      try {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch(() => { });
      } catch (e) { }
    }
  }

  /**
   * Updates the camera position.
   */
  updateCameraPosition() {
    let desiredCameraX = -this.x + 100;
    let endboss = this.world.level.enemies.find((e) => e instanceof Endboss);
    if (endboss) {
      let maxCameraX = -(endboss.x - 100);
      this.world.camera_x = Math.max(desiredCameraX, maxCameraX);
    } else {
      this.world.camera_x = desiredCameraX;
    }
  }

  /**
   * Handles the current animation state.
   */
  handleAnimationState() {
    if (isPaused) return;
    if (this.isDead()) return this.playDeadState();
    if (this.isHurt()) return this.playHurtState();
    if (this.isAboveGround()) return this.playJumpState();
    if (this.isMoving()) return this.playWalkState();
    this.playIdleState();
  }

  /**
   * Checks if the character is moving.
   * @returns {boolean} True if moving
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Plays the dead state.
   */
  playDeadState() {
    this.playAnimation(this.IMAGES_DEAD);
    this.stopWalkingSound();
    if (!this.endGame) {
      setTimeout(() => { this.endGame = true; }, 1000);
    }
  }

  /**
   * Plays the hurt state.
   */
  playHurtState() {
    this.playAnimation(this.IMAGES_HURT);
    this.stopWalkingSound();
  }

  /**
   * Plays the jump state.
   */
  playJumpState() {
    this.playAnimation(this.IMAGES_JUMPING);
    this.stopWalkingSound();
  }

  /**
   * Plays the walk state.
   */
  playWalkState() {
    this.playAnimation(this.IMAGES_WALKING);
    this.stopSnoreSound();
    this.resetLongIdle();
    this.startWalkingSound();
  }

  /**
   * Plays the idle state (short or long).
   */
  playIdleState() {
    this.stopWalkingSound();
    let timeSinceLastActivity = Date.now() - this.lastActivity;
    if (timeSinceLastActivity > 6000) {
      this.playLongIdleAnimation();
    } else {
      this.playNormalIdleAnimation();
    }
  }

  /**
   * Plays the long idle animation with snoring.
   */
  playLongIdleAnimation() {
    if (!this.isLongIdle) {
      this.isLongIdle = true;
      try { this.snoreSound.play().catch(() => { }); } catch (e) { }
    }
    this.playAnimation(this.IMAGES_LONG_IDLE);
  }

  /**
   * Plays the normal idle animation.
   */
  playNormalIdleAnimation() {
    this.resetLongIdle();
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Stops the walking sound.
   */
  stopWalkingSound() {
    if (!this.walkingSound.paused) {
      this.walkingSound.pause();
      this.walkingSound.currentTime = 0;
    }
  }

  /**
   * Starts the walking sound.
   */
  startWalkingSound() {
    if (this.walkingSound.paused) {
      try { this.walkingSound.play().catch(() => { }); } catch (e) { }
    }
  }

  /**
   * Stops the snore sound.
   */
  stopSnoreSound() {
    if (!this.snoreSound.paused) {
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
    }
  }

  /**
   * Resets the long idle status.
   */
  resetLongIdle() {
    if (this.isLongIdle) {
      this.isLongIdle = false;
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
    }
  }

  /**
   * Checks if the character is jumping on an enemy.
   * @param {MovableObject} enemy - The enemy
   * @returns {boolean} True if landing from above
   */
  isJumpingOnEnemy(enemy) {
    return this.isAboveGround() && this.speedY < 0 && this.isColliding(enemy);
  }

  /**
   * Reduces energy when hit.
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = new Date().getTime();
  }
}
